# TODO move to
# class Meta:
#   list_serializer_class =
# https://www.django-rest-framework.org/api-guide/serializers/#customizing-listserializer-behavior
# but it seems it's not support Meta: fields now


class SeparateListObjectSerializerMixin:
    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer_class
        if self.action in ('retrieve', 'partial_update', 'update', 'create'):
            return self.serializer_class
        return self.list_serializer_class


class SeparateFlatCreateUpdateObjectSerializerMixin:
    def get_serializer_class(self):
        if self.action in ('partial_update', 'update', 'create'):
            return self.serializer_class_flat
        return self.serializer_class
