from django.db.models import Q, Count

from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

from rest_framework.viewsets import GenericViewSet
from rest_framework import permissions, status, mixins
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, NotAcceptable
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend

from courses.models import Course, Unit, Module, Lesson, Material, CourseUserDashboard

from ..serializers_public import PublicCourseSerializer, PublicUnitSerializer, PublicModuleSerializer, \
    PublicLessonSerializer, PublicMaterialSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10


class RecentlyFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        filter_param = request.query_params.get('filter')
        if filter_param and filter_param == 'recent':
                # filter for recently Course for current user
                # queryset = queryset. \
                #     filter(units__modules__lessons__progress__profile__user=request.user). \
                #     annotate(updated_on_lastest=Max('units__modules__lessons__progress__updated_on')). \
                #     filter(units__modules__lessons__progress__updated_on=F('updated_on_lastest')). \
                #     order_by('-updated_on_lastest').distinct()

                if request.user.is_authenticated:
                    user = request.user
                else:
                    # return empty queryset, we do not support anonymous recent/my courses now
                    return queryset.none()
                    # user = None

                queryset = queryset.filter(courses_user_dashboard__profile__user=user)
        return queryset


# TODO move to lib app
class SearchMixin:
    # permission_classes=[permissions.IsAuthenticated, ]  # allow anon user use search
    @action(methods=['GET'], detail=False)
    def search(self, request):

        qs = self.get_queryset()

        keywords = request.GET.get('query')
        if not keywords:
            raise NotAcceptable('Search query required')

        query = SearchQuery(keywords)

        if hasattr(self, 'search_fields'):
            vector = SearchVector(*self.search_fields)

        if hasattr(self, 'casting_search_fields'):
            from django.db.models.functions import Cast
            from django.db.models import TextField
            fields = [Cast(val, TextField()) for i, val in enumerate(self.casting_search_fields)]
            vector = SearchVector(*fields)

        qs = qs.annotate(search=vector).filter(Q(tags__name__in=keywords.split(' ')) | Q(search=query))
        qs = qs.annotate(rank=SearchRank(vector, query)).order_by('-rank')

        # search pagination
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)

        return Response(serializer.data)


def get_search_mixin(permission_classes=[]):
    def get_search_func():
        return action(methods=['GET'], detail=False, permission_classes=permission_classes)(SearchMixin.search)

    SearchMixin.search = get_search_func()
    return SearchMixin


class CourseViewSet(mixins.UpdateModelMixin,  # fixme do we need update public course?
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    GenericViewSet,
                    SearchMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PublicCourseSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['name', 'description']

    filter_backends = (filters.OrderingFilter, DjangoFilterBackend, RecentlyFilterBackend) # ordering and search support
    ordering_fields = ('number_of_learners_denormalized', 'published_on', 'created_on',
                       'units__modules__lessons__progress__updated_on')
    lookup_field = 'uuid'
    # ordering = ('-number_of_learners_denormalized',)

    @action(methods=['POST'], detail=True, permission_classes=[permissions.IsAuthenticated, ])
    def add_to_dashboard(self, request, uuid):
        try:
            course = Course.objects.get(uuid=uuid)
        except Course.DoesNotExist:
            raise NotFound()
        CourseUserDashboard.objects.get_or_create(
            profile=request.user.profile,
            course=course
        )

        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=True, permission_classes=[permissions.IsAuthenticated, ])
    def remove_from_dashboard(self, request, uuid):
        try:
            course_user_dashboard = CourseUserDashboard.objects.get(profile=request.user.profile,
                                                                    course__uuid=uuid)
        except CourseUserDashboard.DoesNotExist:
            raise NotFound()

        course_user_dashboard.delete()

        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):

        if self.request.user.is_authenticated:
            profile = self.request.user.profile
            return Course.objects.filter(
                Q(setting_publically=True) |
                Q(Q(author=profile) | Q(collaborators=profile))). \
                select_related('author'). \
                annotate(count_lessons=Count('units__modules__lessons', distinct=True)). \
                order_by('-published_on'). \
                distinct()
        else:
            return Course.objects.filter(
                Q(setting_publically=True)). \
                select_related('author'). \
                annotate(count_lessons=Count('units__modules__lessons', distinct=True)). \
                order_by('-published_on'). \
                distinct()


class UnitViewSet(mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  GenericViewSet,
                  SearchMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Unit.objects.all().order_by('-course__number_of_learners_denormalized', 'uuid')
    serializer_class = PublicUnitSerializer
    lookup_field = 'uuid'
    search_fields = ['name', ]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(course__setting_publically=True) |
                                    Q(Q(course__author=self.request.user.profile) |
                                      Q(course__collaborators=self.request.user.profile))).distinct()
        else:
            return self.queryset.filter(Q(course__setting_publically=True)).distinct()


class ModuleViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet,
                    SearchMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Module.objects.all().order_by('-unit__course__number_of_learners_denormalized', 'uuid')
    serializer_class = PublicModuleSerializer
    lookup_field = 'uuid'
    search_fields = ['name', ]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(unit__course__setting_publically=True) |
                                        Q(Q(unit__course__author=self.request.user.profile) |
                                          Q(unit__course__collaborators=self.request.user.profile))).distinct()
        else:
            return self.queryset.filter(Q(unit__course__setting_publically=True)).distinct()


class LessonViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet,
                    SearchMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Lesson.objects.all().order_by('-module__unit__course__number_of_learners_denormalized', 'uuid')
    serializer_class = PublicLessonSerializer
    search_fields = ['name', ]
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(module__unit__course__setting_publically=True) |
                                        Q(Q(module__unit__course__author=self.request.user.profile) |
                                          Q(module__unit__course__collaborators=self.request.user.profile))).distinct()
        else:
            return self.queryset.filter(Q(module__unit__course__setting_publically=True)).distinct()


class MaterialViewSet(mixins.UpdateModelMixin,
                      mixins.ListModelMixin,
                      GenericViewSet,
                      SearchMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Material.objects.all()\
        .order_by('-lesson__module__unit__course__number_of_learners_denormalized', 'uuid')\
        .select_related('lesson')
    serializer_class = PublicMaterialSerializer
    # search_fields = ['text', ]
    # we do not need 'name' field
    search_fields = ['data', ] # TODO material problem type name!
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    # search will be use text, hint text, answers texts

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(lesson__module__unit__course__setting_publically=True) |
                                        Q(Q(lesson__module__unit__course__author=self.request.user.profile) |
                                          Q(lesson__module__unit__course__collaborators=self.request.user.profile))).distinct()
        else:
            return self.queryset.filter(Q(lesson__module__unit__course__setting_publically=True)).distinct()
