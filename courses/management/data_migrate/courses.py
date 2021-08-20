from ...models.structure.course import Course
from ...models.user_related import CourseUserDashboard
from .units import copy_unit


def copy_curricula(curricula):
    # 1. copy data
    new_course = Course()
    for field in curricula._meta.get_fields():  # True, False?
        # if field.primary_key == True:
        if field.name in ('id', 'uuid', 'units', 'classroom', 'collaborators', 'tagged_items', 'tags'):
            continue
        if field.name == 'author':
            # migrate author from user to profile
            new_field_value = getattr(curricula, field.name).profile
        else:
            new_field_value = getattr(curricula, field.name)

        # new version required 3 symbols in name at least
        if field.name == 'name' and len(getattr(curricula, field.name)) <= 3:
            new_field_value += ' course'

        setattr(new_course, field.name, new_field_value)

    new_course.save()
    # copy tags
    tags = curricula.tags.names()
    new_course.tags.set(*tags, clear=True)
    # set() classrooms
    new_course.classroom_set.set(curricula.classroom_set.all(), clear=True)
    # set() collaborators
    new_course.collaborators.set(curricula.collaborators.all(), clear=True)
    # copy dashboards
    dashboards_list = []
    for dashboard in curricula.curricula_user_dashboard.all():
        dashboards_list.append(CourseUserDashboard(course=new_course, profile=dashboard.profile))
    CourseUserDashboard.objects.bulk_create(dashboards_list)
    # copy units
    for unit in curricula.units.all():
        copy_unit(new_course, unit)
