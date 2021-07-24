import Cookies from 'js-cookie'

import history from '../history'

// import { angleToVector, vectorToAngle
// } from '../utils/vectors'
// import { validateQuantityUnit, splitQuantityUnit
// } from '../utils/units'

// TODO replace all $.ajax with axios
import request from '../utils/request'
import {
  checkHttpError,
  getAxios,
} from '../../../../../resources/static/resources/js/utils'
import { MATERIAL_FETCHING } from '../constants'

export const API_PREFIX = '/api/v1/studio/'
const API_PROFILE_PREFIX = '/api/v1/profiles/'

var getCookie = Cookies.get

// TODO move constants to /constants

export const ActionTypes = Object.freeze({
  REQUEST_ADD_COURSE: 'REQUEST_ADD_COURSE',
  COURSES_LOADED: 'COURSES_LOADED',
  ALL_COURSES_LOADED: 'ALL_COURSES_LOADED',
  SEARCH_COURSES_LOADED: 'SEARCH_COURSES_LOADED',
  SEARCH_UNITS_LOADED: 'SEARCH_UNITS_LOADED',
  SEARCH_MODULES_LOADED: 'SEARCH_MODULES_LOADED',
  SEARCH_LESSONS_LOADED: 'SEARCH_LESSONS_LOADED',
  RECENT_COURSES_LOADED: 'RECENT_COURSES_LOADED',
  POPULAR_COURSES_LOADED: 'POPULAR_COURSES_LOADED',
  SEARCH_MATERIALS_LOADED: 'SEARCH_MATERIALS_LOADED',
  NEW_COURSES_LOADED: 'NEW_COURSES_LOADED',
  LOAD_COURSES: 'LOAD_COURSES',
  COURSES_FETCHING: 'COURSES_FETCHING',
  PUBLIC_COURSE_LOADED: 'PUBLIC_COURSE_LOADED',
  COURSE_LOADED: 'COURSE_LOADED',
  RENAME_COURSE: 'RENAME_COURSE',
  CHANGE_COURSE_IMAGE: 'CHANGE_COURSE_IMAGE',
  DELETE_COURSE: 'DELETE_COURSE',
  UNIT_LOADED: 'UNIT_LOADED',
  UNIT_ADDED: 'UNIT_ADDED',
  DELETE_UNIT: 'DELETE_UNIT',
  MODULE_ADDED: 'MODULE_ADDED',
  MODULE_LOADED: 'MODULE_LOADED',
  DELETE_MODULE: 'DELETE_MODULE',
  LESSON_LOADED: 'LESSON_LOADED',
  LESSON_AVAILABLE: 'LESSON_AVAILABLE',
  LESSON_ADDED: 'LESSON_ADDED',
  GOTO_LESSON: 'GOTO_LESSON',
  DELETE_LESSON: 'DELETE_LESSON',
  MATERIAL_LOADED: 'MATERIAL_LOADED',
  MATERIAL_ADDED: 'MATERIAL_ADDED',
  MATERIAL_MOVED: 'MATERIAL_MOVED',
  GOTO_MATERIAL: 'GOTO_MATERIAL',
  DELETE_MATERIAL: 'DELETE_MATERIAL',
  STUDIO_TAB_CHANGED: 'STUDIO_TAB_CHANGED',
  FOUND_USERS_LOADED: 'FOUND_USERS_LOADED',
  FOUND_USERS_REQUEST: 'FOUND_USERS_REQUEST',
  COURSE_NAVIGATION_COURSES_LOADED: 'COURSE_NAVIGATION_COURSES_LOADED',
  COURSE_NAVIGATION_UNITS_LOADED: 'COURSE_NAVIGATION_UNITS_LOADED',
  COURSE_NAVIGATION_MODULES_LOADED: 'COURSE_NAVIGATION_MODULES_LOADED',
  COURSE_NAVIGATION_LESSONS_LOADED: 'COURSE_NAVIGATION_LESSONS_LOADED',
})

export function courseAdded(course) {
  return { type: ActionTypes.COURSE_ADDED, course: course }
}

export function changeStudioSelectedTab(selectedTab, tabNamespace) {
  // reload courses

  return function(dispatch) {
    // see also courses/static/courses/js/containers/BrowseViews/IndexView/index.jsx^437
    const loadRecentCourses = url => dispatch(loadAllCourses(url, 'recent'))
    const loadNewCourses = url =>
      dispatch(loadAllCourses(url, null, '-created_on'))
    const loadPopularCourses = url =>
      dispatch(loadAllCourses(url, null, '-number_of_learners_denormalized')) // popular

    if (selectedTab == 'studio') {
      // reload courses
      dispatch(loadCourses())
    } else selectedTab == 'browse'
    {
      loadPopularCourses()
      loadRecentCourses()
      loadNewCourses()
    }

    dispatch(
      (function() {
        return {
          type: ActionTypes.STUDIO_TAB_CHANGED,
          tab: selectedTab,
          namespace: tabNamespace,
        }
      })(),
    )
  }
}

export function addCourseTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'courses/' + uuid + '/tags/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function deleteCourseTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'courses/' + uuid + '/tags/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function addUnitTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'units/' + uuid + '/tags/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function deleteUnitTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'units/' + uuid + '/tags/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function addModuleTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'modules/' + uuid + '/tags/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function deleteModuleTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'modules/' + uuid + '/tags/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    })
  }
}

export function addMaterialTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'materials/' + uuid + '/tags/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    }).then(value => {
      $.ajax({
        async: true,
        url: API_PREFIX + 'materials/' + uuid + '/',
        success: function(data, status, jqXHR) {
          dispatch(materialLoaded(data))
        },
      })
    })
  }
}

export function deleteMaterialTag(uuid, tag) {
  return function(dispatch) {
    request(API_PREFIX + 'materials/' + uuid + '/tags/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ tag: tag.text }),
    }).then(value => {
      $.ajax({
        async: true,
        url: API_PREFIX + 'materials/' + uuid + '/',
        success: function(data, status, jqXHR) {
          dispatch(materialLoaded(data))
        },
      })
    })
  }
}

export function addCourse(prototype) {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'courses/',
      method: 'POST',
      data: {
        name: 'New course',
        prototype: prototype,
      },
      success: function(data, status, jqXHR) {
        dispatch(courseLoaded(data))
        history.push('/studio/editor/courses/' + data.uuid + '/')
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status === 403) {
          document.location.href = '/accounts/login/?next=/browse/'
        }
      },
    })
  }
}

export function addCourseToDashboard(uuid) {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'public/courses/' + uuid + '/add_to_dashboard/',
      method: 'POST',
      success: function(data, status, jqXHR) {},
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status === 403) {
          // TODO implement with pop up messages/alerts
          alert('Please login or sign up to use your dashboard')
        }
      },
    })
  }
}

export function removeCourseFromDashboard(uuid) {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'public/courses/' + uuid + '/remove_from_dashboard/',
      method: 'POST',
      success: function(data, status, jqXHR) {},
    })
  }
}

export function coursesLoaded(data) {
  var units = extractAll(data, 'units')
  var modules = extractAll(units, 'modules')

  return {
    type: ActionTypes.COURSES_LOADED,
    courses: data,
    units: units,
    modules: modules,
  }
}

function extract(object, prop) {
  // This function change object! :(
  // TODO remove this!
  var ret = object[prop]
  var ids = []
  for (var k in object[prop]) {
    ids.push(k)
  }
  Object.assign(object, { [prop]: ids })
  return ret
}

function extractAll(object, prop) {
  var ret = {}
  for (var k in object) {
    Object.assign(ret, extract(object[k], prop))
  }
  return ret
}

export function allCoursesLoaded(data, filter, ordering) {
  var type = ActionTypes.ALL_COURSES_LOADED
  if (filter === 'recent') {
    type = ActionTypes.RECENT_COURSES_LOADED
  }
  if (ordering === '-created_on') {
    type = ActionTypes.NEW_COURSES_LOADED
  }
  if (ordering === '-number_of_learners_denormalized') {
    type = ActionTypes.POPULAR_COURSES_LOADED
  }
  return {
    type: type,
    courses: data,
  }
}

// Public courses
export function loadAllCourses(url, filter, ordering) {
  return function(dispatch) {
    var GETParams = {}
    if (filter) {
      GETParams['filter'] = filter
    }
    if (ordering) {
      GETParams['ordering'] = ordering
    }

    var paramsString = ''

    if (Object.keys(GETParams).length !== 0) {
      paramsString =
        '?' +
        Object.entries(GETParams)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
    }
    $.ajax({
      async: true,
      url: url || API_PREFIX + 'public/courses/' + paramsString,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(allCoursesLoaded(data, filter, ordering))
      },
    })
  }
}

const myCoursesFetching = () => {
  return {
    type: ActionTypes.COURSES_FETCHING,
  }
}

// TODO add pagination
// user created courses (myCourses)
export function loadCourses() {
  return function(dispatch) {
    // load public separately!
    // dispatch(loadAllCourses())
    dispatch(myCoursesFetching())
    return getAxios()
      .get(API_PREFIX + 'courses/')
      .catch(checkHttpError)
      .then(response => {
        dispatch(coursesLoaded(response.data))
      })
  }
}

//// the same loadCourses function
// export function loadMyCourses() {
//   return function(dispatch) {
//     $.ajax({
//       async: true,
//       url: API_PREFIX + 'courses/',
//       context: this,
//       success: function(data, status, jqXHR) {
//         dispatch(data => {
//           return {
//             type: ActionTypes.COURSES_LOADED,
//             courses: data,
//           }
//         })
//       },
//     })
//   }
// }

function coursesSearchLoaded(data) {
  var type = ActionTypes.SEARCH_COURSES_LOADED
  return {
    type: type,
    coursesSearchList: data,
  }
}

export function loadSearchCourses(searchString, nextPageUrl) {
  var url = API_PREFIX + 'public/courses/' // all units

  if (searchString) {
    url = API_PREFIX + 'public/courses/search/?query=' + searchString
  }

  if (nextPageUrl) {
    url = nextPageUrl
  }

  return function(dispatch) {
    $.ajax({
      async: true,
      url: url,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(coursesSearchLoaded(data))
      },
    })
  }
}

function unitsSearchLoaded(data) {
  var type = ActionTypes.SEARCH_UNITS_LOADED
  return {
    type: type,
    untisSearchList: data,
  }
}

export function loadSearchUnits(searchString, nextPageUrl) {
  var url = API_PREFIX + 'public/units/' // all units

  if (searchString) {
    url = API_PREFIX + 'public/units/search/?query=' + searchString
  }

  if (nextPageUrl) {
    url = nextPageUrl
  }

  return function(dispatch) {
    $.ajax({
      async: true,
      url: url,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(unitsSearchLoaded(data))
      },
    })
  }
}

function modulesSearchLoaded(data) {
  var type = ActionTypes.SEARCH_MODULES_LOADED
  return {
    type: type,
    modulesSearchList: data,
  }
}

export function loadSearchModules(searchString, nextPageUrl) {
  var url = API_PREFIX + 'public/modules/' // all units

  if (searchString) {
    url = API_PREFIX + 'public/modules/search/?query=' + searchString
  }

  if (nextPageUrl) {
    url = nextPageUrl
  }

  return function(dispatch) {
    $.ajax({
      async: true,
      url: url,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(modulesSearchLoaded(data))
      },
    })
  }
}

function lessonsSearchLoaded(data) {
  var type = ActionTypes.SEARCH_LESSONS_LOADED
  return {
    type: type,
    lessonsSearchList: data,
  }
}

export function loadSearchLessons(searchString, nextPageUrl) {
  var url = API_PREFIX + 'public/lessons/'

  if (searchString) {
    url = API_PREFIX + 'public/lessons/search/?query=' + searchString
  }

  if (nextPageUrl) {
    url = nextPageUrl
  }

  return function(dispatch) {
    $.ajax({
      async: true,
      url: url,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(lessonsSearchLoaded(data))
      },
    })
  }
}

function materialsSearchLoaded(data) {
  var type = ActionTypes.SEARCH_MATERIALS_LOADED
  return {
    type: type,
    materialsSearchList: data,
  }
}

export function loadSearchMaterials(searchString, nextPageUrl) {
  var url = API_PREFIX + 'public/materials/'

  if (searchString) {
    url = API_PREFIX + 'public/materials/search/?query=' + searchString
  }

  if (nextPageUrl) {
    url = nextPageUrl
  }

  return function(dispatch) {
    $.ajax({
      async: true,
      url: url,
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(materialsSearchLoaded(data))
      },
    })
  }
}

export function courseLoaded(data) {
  var units = extract(data, 'units')
  var modules = extractAll(units, 'modules')
  return {
    type: ActionTypes.COURSE_LOADED,
    course: data,
    units: units,
    modules: modules,
  }
}

export function renameCourse(uuid, newName) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'courses/' + uuid + '/',
      type: 'PATCH',
      data: { name: newName },
      success: function(data, status, jqXHR) {
        dispatch(courseLoaded(data))
      },
    })
  }
}

export function saveCourseDescription(uuid, newText) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'courses/' + uuid + '/',
      type: 'PATCH',
      data: { description: newText },
      success: function(data, status, jqXHR) {
        dispatch(courseLoaded(data))
      },
    })
  }
}

export function publicCourseLoaded(data) {
  return {
    type: ActionTypes.PUBLIC_COURSE_LOADED,
    publicCourse: data,
  }
}

export function loadPublicCourse(uuid) {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'public/courses/' + uuid + '/',
      success: function(data, status, jqXHR) {
        dispatch(publicCourseLoaded(data))
      },
    })
  }
}

function loadCourse(uuid, dispatch) {
  $.ajax({
    async: true,
    url: API_PREFIX + 'courses/' + uuid + '/',
    success: function(data, status, jqXHR) {
      dispatch(courseLoaded(data))
    },
    error: function(xhr, ajaxOptions, thrownError) {
      if (xhr.status === 404) {
        // fixme, not so good:
        // 1) user start request to backend
        // 2) user moved the another url of SPA (which no depend of request from 1) )
        // 3) response from 1) not found and weill move user to 404 instead 2)
        history.replace('404')
      }
    },
  })
}

export function updateCourse(course) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'courses/' + course.uuid + '/',
      dataType: 'json', // due https://github.com/encode/django-rest-framework/issues/5807
      contentType: 'application/json',
      type: 'PATCH',
      data: JSON.stringify(course),
      success: function(data, status, jqXHR) {
        dispatch(courseLoaded(data))
      },
    })
  }
}

export function loadCourseIfNeeded(uuid) {
  return (dispatch, getState) => {
    if (!(uuid in getState().studio.courses)) {
      loadCourse(uuid, dispatch)
    }
  }
}

export function changeCourseImage(uuid, image) {
  return dispatch => {
    var formData = new FormData()
    if (image == null) {
      // delete image
      formData.append('image', '')
    } else {
      formData.append('image', image, image.filename)
    }
    // formData.append('image', image)
    $.ajax({
      url: API_PREFIX + 'courses/' + uuid + '/',
      type: 'PATCH',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data) {
        dispatch(courseLoaded(data))
      },
    })
  }
}

export function changeCourseCoverPhoto(uuid, image) {
  return dispatch => {
    var formData = new FormData()
    if (image == null) {
      // delete photo
      formData.append('cover_photo', '')
    } else {
      formData.append('cover_photo', image, image.filename)
    }
    $.ajax({
      url: API_PREFIX + 'courses/' + uuid + '/',
      type: 'PATCH',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data) {
        dispatch(courseLoaded(data))
      },
    })
  }
}

export function deleteCourse(uuid) {
  return dispatch => {
    dispatch({
      type: ActionTypes.DELETE_COURSE,
      uuid: uuid,
    })
    $.ajax({
      async: true,
      url: API_PREFIX + 'courses/' + uuid + '/',
      method: 'DELETE',
      success: function(data, status, jqXHR) {
        history.push('/studio/')
        // TODO: reload all courses
      },
    })
  }
}

export function unitAdded(courseUuid, data) {
  return {
    type: ActionTypes.UNIT_ADDED,
    courseUuid: courseUuid,
    unit: data,
    modules: extract(data, 'modules'),
  }
}

export function addUnit(courseUuid, unit) {
  var data = { name: 'New unit', course: courseUuid }
  if (unit) {
    data['prototype'] = unit.uuid
    data['name'] = unit.name
  }

  return dispatch => {
    $.ajax({
      async: true,
      url: API_PREFIX + 'units/',
      method: 'POST',
      data: data,
      success: function(data, status, jqXHR) {
        // dispatch(unitAdded(courseUuid, data))
        // reload expanded
        loadCourse(courseUuid, dispatch)
        history.push('/studio/editor/courses/' + courseUuid + '/')
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status === 403) {
          document.location.href = '/accounts/login/?next=/browse/'
        }
      },
    })
  }
}

export function addToNewCourse(type, value) {
  return dispatch => {
    $.ajax({
      // create course
      async: true,
      url: API_PREFIX + 'courses/',
      method: 'POST',
      data: {
        name: 'New course',
      },
      success: function(data, status, jqXHR) {
        var unitData = { name: 'New unit', course: data.uuid }

        if (type === 'unit') {
          unitData['prototype'] = value.uuid
          unitData['name'] = value.name
        }

        $.ajax({
          async: true,
          url: API_PREFIX + 'units/',
          method: 'POST',
          data: unitData,
          success: function(data, status, jqXHR) {
            if (type === 'unit') {
              // dispatch(unitAdded(unitData.course, data))
              loadCourse(unitData.course, dispatch)
              history.push('/studio/editor/courses/' + unitData.course + '/')
            } else {
              // create module
              var moduleData = { name: 'New module', unit: data.uuid }

              if (type === 'module') {
                moduleData['prototype'] = value.uuid
                moduleData['name'] = value.name
              }

              $.ajax({
                async: true,
                url: API_PREFIX + 'modules/',
                method: 'POST',
                data: moduleData,
                success: function(data, status, jqXHR) {
                  if (type === 'module') {
                    // dispatch(moduleAdded(data))
                    loadCourse(unitData.course, dispatch)
                    history.push('/studio/editor/modules/' + data.uuid + '/')
                  } else {
                    // create lesson
                    var lessonData = { name: 'New lesson', module: data.uuid }

                    if (type === 'lesson') {
                      // lesson prototype
                      lessonData['prototype'] = value.uuid
                      lessonData['name'] = value.name
                    }

                    // load created module
                    // dispatch(loadModuleIfNeeded(data.uuid))

                    $.ajax({
                      async: true,
                      url: API_PREFIX + 'lessons/',
                      method: 'POST',
                      data: lessonData,
                      success: function(data, status, jqXHR) {
                        if (type === 'lesson') {
                          // var materials = extract(data, 'materials')
                          // dispatch({
                          //   type: ActionTypes.LESSON_ADDED,
                          //   lesson: data,
                          //   materials: materials,
                          //   answers: extractAll(materials, 'answers')
                          // })
                          history.push(
                            '/studio/editor/lessons/' + data.uuid + '/',
                          )
                        } else {
                          // add material
                          var materialData = {
                            name: 'New material',
                            lesson: data.uuid,
                          }

                          if (type === 'material') {
                            // material prototype
                            materialData['prototype'] = value.uuid
                            materialData['text'] = value.text
                          }

                          $.ajax({
                            async: true,
                            method: 'POST',
                            url: API_PREFIX + 'materials/',
                            data: materialData,
                            success: function(data, status, jqXHR) {
                              history.push(
                                '/studio/editor/lessons/' + data.lesson + '/',
                              )
                            },
                          })
                        }
                      },
                    })
                  }
                },
              })
            }
          },
        })
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status === 403) {
          document.location.href = '/accounts/login/?next=/browse/'
        }
      },
    })
  }
}

export function deleteUnit(unitUuid) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.DELETE_UNIT,
      courseUuid: getState().studio.units[unitUuid].course,
      uuid: unitUuid,
    })
    $.ajax({
      async: true,
      url: API_PREFIX + 'units/' + unitUuid + '/',
      method: 'DELETE',
      success: function(data, status, jqXHR) {
        // dispatch(unitDeleted(unitUuid))
      },
    })
  }
}

export function renameUnit(uuid, newName) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'units/' + uuid + '/',
      type: 'PATCH',
      data: { name: newName },
      success: function(data, status, jqXHR) {
        dispatch(unitLoaded(data))
      },
    })
  }
}

export function unitLoaded(data) {
  return {
    type: ActionTypes.UNIT_LOADED,
    unit: data,
    modules: extract(data, 'modules'),
  }
}

export function changeUnitImage(uuid, image) {
  return dispatch => {
    var formData = new FormData()
    formData.append('image', image)
    $.ajax({
      url: API_PREFIX + 'units/' + uuid + '/',
      type: 'PATCH',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data) {
        dispatch(unitLoaded(data))
      },
    })
  }
}

export function moveUnit(uuid, beforeUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var newPosition
    if (beforeUuid) {
      newPosition = state.units[beforeUuid].position
    } else {
      var cur = state.courses[state.units[uuid].course]
      newPosition = state.units[cur.units[cur.units.length - 1]].position + 1
    }
    $.ajax({
      async: true,
      url: API_PREFIX + 'units/' + uuid + '/',
      method: 'PATCH',
      data: { position: newPosition },
      success: function(data, status, jqXHR) {
        loadCourse(data.course, dispatch)
      },
    })
  }
}

export function moduleAdded(data) {
  return {
    type: ActionTypes.MODULE_ADDED,
    module: data,
    lessons: extract(data, 'lessons'),
  }
}

export function addModule(unitUuid, module) {
  var data = { name: 'New module', unit: unitUuid }
  if (module) {
    data['prototype'] = module.uuid
    data['name'] = module.name
  }

  return dispatch => {
    $.ajax({
      async: true,
      url: API_PREFIX + 'modules/',
      method: 'POST',
      data: data,
      success: function(data, status, jqXHR) {
        dispatch(moduleAdded(data))
        history.push('/studio/editor/modules/' + data.uuid + '/')
      },
    })
  }
}

export function moduleLoaded(data) {
  return {
    type: ActionTypes.MODULE_LOADED,
    module: data,
    lessons: extract(data, 'lessons'),
  }
}

export function renameModule(uuid, newName) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'modules/' + uuid + '/',
      type: 'PATCH',
      data: { name: newName },
      success: function(data, status, jqXHR) {
        dispatch(moduleLoaded(data))
      },
    })
  }
}

export function changeModuleImage(uuid, image) {
  return dispatch => {
    var formData = new FormData()
    formData.append('image', image)
    $.ajax({
      url: API_PREFIX + 'modules/' + uuid + '/',
      type: 'PATCH',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data) {
        dispatch(moduleLoaded(data))
      },
    })
  }
}

export function moveModule(uuid, toUnitUuid, beforeUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var toUnit = state.units[toUnitUuid]
    var fromUnit = state.units[state.modules[uuid].unit]
    var newPosition
    if (beforeUuid) {
      newPosition = state.modules[beforeUuid].position
    } else if (toUnit.modules.length > 0) {
      newPosition =
        state.modules[toUnit.modules[toUnit.modules.length - 1]].position + 1
    } else {
      newPosition = 1
    }
    $.ajax({
      async: true,
      url: API_PREFIX + 'modules/' + uuid + '/',
      method: 'PATCH',
      data: {
        position: newPosition,
        unit: toUnitUuid,
      },
      success: function(data, status, jqXHR) {
        $.ajax({
          async: true,
          url: API_PREFIX + 'units/' + toUnitUuid + '/',
          method: 'GET',
          success: function(data, status, jqXHR) {
            dispatch(unitLoaded(data))
          },
        })
        if (toUnitUuid != fromUnit.uuid) {
          $.ajax({
            async: true,
            url: API_PREFIX + 'units/' + fromUnit.uuid + '/',
            method: 'GET',
            success: function(data, status, jqXHR) {
              dispatch(unitLoaded(data))
            },
          })
        }
      },
    })
  }
}

export function deleteModule(moduleUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var course = state.modules[moduleUuid].course
    dispatch({
      type: ActionTypes.DELETE_MODULE,
      unitUuid: state.modules[moduleUuid].unit,
      uuid: moduleUuid,
    })
    $.ajax({
      async: true,
      url: API_PREFIX + 'modules/' + moduleUuid + '/',
      method: 'DELETE',
      success: function(data, status, jqXHR) {
        history.push('/studio/editor/courses/' + course + '/')
      },
    })
  }
}

export function loadModuleIfNeeded(uuid) {
  return (dispatch, getState) => {
    if (
      !(uuid in getState().studio.modules) ||
      !('lessons' in getState().studio.modules[uuid])
    ) {
      $.ajax({
        async: true,
        url: API_PREFIX + 'modules/' + uuid + '/',
        success: function(data, status, jqXHR) {
          dispatch(moduleLoaded(data))
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (xhr.status === 404) {
            // fixme, not so good:
            // 1) user start request to backend
            // 2) user moved the another url of SPA (which no depend of request from 1) )
            // 3) response from 1) not found and weill move user to 404 instead 2)
            history.replace('404')
          }
        },
      })
    }
  }
}

export function addLesson(moduleUuid, lesson) {
  var data = { name: 'New lesson', module: moduleUuid }
  if (lesson) {
    data['prototype'] = lesson.uuid
    data['name'] = lesson.name
  }
  return dispatch => {
    if (lesson) {
      // load module
      dispatch(loadModuleIfNeeded(moduleUuid))
    }

    $.ajax({
      async: true,
      url: API_PREFIX + 'lessons/',
      method: 'POST',
      data: data,
      success: function(data, status, jqXHR) {
        // remove this ugly procces
        // var materials = extract(data, 'materials')

        // todo move to the new func - see lessonLoaded
        // copy list of materials
        var materials = {}
        data['materials'].forEach(material => {
          materials[material.uuid] = material
        })

        // convert list of materials to list of uuid
        data['materials'] = data['materials'].map(item => item.uuid)

        dispatch({
          type: ActionTypes.LESSON_ADDED,
          lesson: data,
          materials: materials,
        })
        dispatch(redirectTo1stMaterial(data))
        // history.push('/studio/editor/lessons/' + data.uuid + '/')
      },
    })
  }
}

function redirectTo1stMaterial(lesson) {
  return (dispatch, getState) => {
    // materials: Array(5)
    // 0: "3ecaf3d9-87d4-4496-b9f1-79f9f22b8b83"
    // 1: "2b5b3dc9-d6f8-4786-b589-d911ac4a8e36"
    // NOTE: materials is array of uuids after 'extract' data,
    // I think we need to remove this useless 'extract' data function at all in the future
    if (lesson.materials && lesson.materials.length > 0) {
      dispatch(goToMaterial(lesson.materials[0], lesson.uuid))
    }
  }
}

export function lessonLoaded(data) {
  // var materials = extract(data, 'materials')
  // extract function:
  // return materials as {{},{}}
  // convert data['materials'] from [{},{}] to [uuid1, uuid2]
  // very confusing behavior!

  // we get list of materials instead dict of UUID from API now
  // see studio/serializers.py for detail
  // so we need to rewrite extract()

  // copy list of materials
  var materials = {}
  data['materials'].forEach(material => {
    materials[material.uuid] = material
  })

  // convert list of materials to list of uuid
  data['materials'] = data['materials'].map(item => item.uuid)

  return {
    type: ActionTypes.LESSON_LOADED,
    lesson: data,
    materials: materials,
  }
}

export function lessonAvailable(lesson) {
  return {
    type: ActionTypes.LESSON_AVAILABLE,
    lesson: lesson,
  }
}

export function loadLessonIfNeeded(uuid, materialUuid) {
  return (dispatch, getState) => {
    if (
      !(uuid in getState().studio.lessons) ||
      !getState().studio.lessons[uuid].materials
    ) {
      $.ajax({
        async: true,
        url: API_PREFIX + 'lessons/' + uuid + '/',
        success: function(data, status, jqXHR) {
          dispatch(lessonLoaded(data))

          if (
            materialUuid && // if we have materialUuid to move on
            getState().studio.lessons[uuid].materials.includes(materialUuid) // and materialUuid exist in materials list
          ) {
            // select current material
            dispatch(goToMaterial(materialUuid, uuid))
          } else {
            // select 1st material
            dispatch(redirectTo1stMaterial(data))
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (xhr.status === 404) {
            // fixme, not so good:
            // 1) user start request to backend
            // 2) user moved the another url of SPA (which no depend of request from 1) )
            // 3) response from 1) not found and weill move user to 404 instead 2)
            history.replace('404')
          }
        },
      })
    } else {
      dispatch(lessonAvailable(getState().studio.lessons[uuid]))
    }
  }
}

export function renameLesson(uuid, newName) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'lessons/' + uuid + '/',
      type: 'PATCH',
      data: { name: newName },
      success: function(data, status, jqXHR) {
        dispatch(lessonLoaded(data))
      },
    })
  }
}

export function changeCompleteBoundary(uuid, value) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'lessons/' + uuid + '/',
      type: 'PATCH',
      data: { complete_boundary: value },
      success: function(data, status, jqXHR) {
        dispatch(lessonLoaded(data))
      },
    })
  }
}

export function changeLessonImage(uuid, image) {
  return dispatch => {
    var formData = new FormData()
    formData.append('image', image)
    $.ajax({
      url: API_PREFIX + 'lessons/' + uuid + '/',
      type: 'PATCH',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data) {
        dispatch(lessonLoaded(data))
      },
    })
  }
}

// export function changeLessonType (uuid, newType) {
//   return function (dispatch) {
//     $.ajax({
//       url: API_PREFIX + 'lessons/' + uuid + '/',
//       type: 'PATCH',
//       data: {lesson_type: newType},
//       success: function (data, status, jqXHR) {
//         dispatch(lessonLoaded(data))
//       }
//     })
//   }
// }

// export function changeLessonGameType (uuid, newType) {
//   return function (dispatch) {
//     $.ajax({
//       url: API_PREFIX + 'lessons/' + uuid + '/',
//       type: 'PATCH',
//       data: {game_type: newType},
//       success: function (data, status, jqXHR) {
//         dispatch(lessonLoaded(data))
//       }
//     })
//   }
// }

export function moveLesson(uuid, toModuleUuid, beforeLessonUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var toModule = state.modules[toModuleUuid]
    var newPosition
    if (beforeLessonUuid) {
      newPosition = state.lessons[beforeLessonUuid].position
    } else if (toModule && toModule.lessons.length > 0) {
      newPosition =
        state.lessons[toModule.lessons[toModule.lessons.length - 1]].position +
        1
    } else {
      newPosition = 1
    }
    $.ajax({
      async: true,
      url: API_PREFIX + 'lessons/' + uuid + '/',
      method: 'PATCH',
      data: {
        position: newPosition,
        module: toModuleUuid,
      },
      success: function(data, status, jqXHR) {
        $.ajax({
          async: true,
          url: API_PREFIX + 'modules/' + toModuleUuid + '/',
          method: 'GET',
          success: function(data, status, jqXHR) {
            dispatch(moduleLoaded(data))
          },
        })
      },
    })
  }
}

export function deleteLesson(lessonUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var moduleUuid = state.lessons[lessonUuid].module
    dispatch({
      type: ActionTypes.DELETE_LESSON,
      moduleUuid: moduleUuid,
      uuid: lessonUuid,
    })
    $.ajax({
      async: true,
      url: API_PREFIX + 'lessons/' + lessonUuid + '/',
      method: 'DELETE',
      success: function(data, status, jqXHR) {
        history.push('/studio/editor/modules/' + moduleUuid + '/')
      },
    })
  }
}

export function materialLoaded(data) {
  return {
    type: ActionTypes.MATERIAL_LOADED,
    material: data,
  }
}

export function loadMaterial(uuid) {
  return (dispatch, getState) => {
    // load full version of a material
    $.ajax({
      async: true,
      url: API_PREFIX + 'materials/' + uuid + '/',
      success: function(data, status, jqXHR) {
        dispatch(materialLoaded(data))
      },
    })
  }
}

export function setMaterialProblemType(material, materialProblemType) {
  return (dispatch, state) => {
    return getAxios()
      .post(
        API_PREFIX +
          'materials/' +
          material.uuid +
          '/set_material_problem_type/',
        materialProblemType,
      )
      .catch(checkHttpError)
      .then(response => {
        dispatch(materialLoaded(response.data))
      })
  }
}

// TODO replace with updateMaterial all below
export function updateMaterial(material) {
  return (dispatch, state) => {
    return getAxios()
      .patch(API_PREFIX + 'materials/' + material.uuid + '/', material)
      .catch(checkHttpError)
      .then(response => {
        dispatch(materialLoaded(response.data))
      })

    // $.ajax({
    //   url: API_PREFIX + 'materials/' + uuid + '/',
    //   type: 'PATCH',
    //   data: {name: newText},
    //   success: function (data, status, jqXHR) {
    //     dispatch(materialLoaded(data))
    //   }
    // })
  }
}

export function changeMaterialName(uuid, newText) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'materials/' + uuid + '/',
      type: 'PATCH',
      data: { name: newText },
      success: function(data, status, jqXHR) {
        dispatch(materialLoaded(data))
      },
    })
  }
}

export function changeMaterialSolutionText(uuid, newSolutionText) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'materials/' + uuid + '/',
      type: 'PATCH',
      data: { solution_text: newSolutionText },
      success: function(data, status, jqXHR) {
        dispatch(materialLoaded(data))
      },
    })
  }
}

// export function changeMaterialType (uuid, newType) {
//   return function (dispatch, getState) {
//     var state = getState().studio
//     // var oldAnswerIds
//     var data = {answer_type: newType}
//     if (state.preservedAnswers[uuid]) {
//       data['answers'] = JSON.stringify(state.preservedAnswers[uuid][newType])
//     }
//
//     dispatch(preserveAnswers(uuid))
//     $.ajax({
//       url: API_PREFIX + 'materials/' + uuid + '/',
//       type: 'PATCH',
//       data: data,
//       success: function (data, status, jqXHR) {
//         dispatch(materialLoaded(data))
//       }
//     })
//   }
// }

// export function changeMaterialImage (uuid, image) {
//   return dispatch => {
//     var formData = new FormData()
//     formData.append('image', image)
//     $.ajax({
//       url: API_PREFIX + 'materials/' + uuid + '/',
//       type: 'PATCH',
//       processData: false,
//       contentType: false,
//       data: formData,
//       success: function (data) {
//         dispatch(materialLoaded(data))
//       }
//     })
//   }
// }

export function changeMaterialHint(uuid, newHint) {
  return function(dispatch) {
    $.ajax({
      url: API_PREFIX + 'materials/' + uuid + '/',
      type: 'PATCH',
      data: { hint: newHint },
      success: function(data, status, jqXHR) {
        dispatch(materialLoaded(data))
      },
    })
  }
}
// END of TODO: replace with updateMaterial

export function goToMaterial(materialUuid, lessonUuid) {
  return (dispatch, getState) => {
    const currentMaterialUuid = getState().studio.currentMaterial?.uuid
    if (currentMaterialUuid === materialUuid) {
      // if materialUuid == state.materialUuid do nothing
      return null
    }

    if (materialUuid) {
      // navigate to load a full version
      dispatch({
        type: ActionTypes.GOTO_MATERIAL,
        material: { uuid: materialUuid },
        lesson: { uuid: lessonUuid },
      })
      // get fresh version every time we navigate to material, we can cache it in the future
      dispatch(loadMaterial(materialUuid))
    } else {
      // navigate to empty lesson
      dispatch({
        type: ActionTypes.GOTO_LESSON,
        lesson: { uuid: lessonUuid },
      })
    }
  }
}

export function addMaterial(lessonUuid, material) {
  let data = { name: 'New material', lesson: lessonUuid }
  if (material) {
    data['prototype'] = material.uuid
  }

  return dispatch => {
    $.ajax({
      async: true,
      method: 'POST',
      url: API_PREFIX + 'materials/',
      data: data, // {lesson : lesson, text : 'New material'},
      success: function(data, status, jqXHR) {
        if (data) {
          dispatch({
            type: ActionTypes.MATERIAL_ADDED,
            material: data,
            lesson: { uuid: lessonUuid },
          })
        } else {
          console.log('material was not saved')
        }
      },
    })
  }
}

export function moveMaterial(uuid, beforeUuid) {
  return (dispatch, getState) => {
    var state = getState().studio
    var lessonUuid = state.materials[uuid].lesson
    var newPosition
    if (beforeUuid) {
      newPosition = state.materials[beforeUuid].position
    } else {
      var lesson = state.lessons[lessonUuid]
      newPosition =
        state.materials[lesson.materials[lesson.materials.length - 1]]
          .position + 1
    }

    $.ajax({
      async: true,
      url: API_PREFIX + 'materials/' + uuid + '/',
      method: 'PATCH',
      data: { position: newPosition },
      success: function(data, status, jqXHR) {
        dispatch({
          type: ActionTypes.MATERIAL_MOVED,
          uuid: uuid,
          beforeUuid: beforeUuid,
          lessonUuid: lessonUuid,
        })
      },
    })
  }
}

export function deleteMaterial(uuid) {
  return (dispatch, getState) => {
    let state = getState().studio
    let currentLesson = state.lessons[state.materials[uuid].lesson]

    const index = currentLesson.materials.indexOf(uuid)

    let willGoToMaterialUuid = null // null we have no existing materials
    if (typeof currentLesson.materials[index + 1] !== 'undefined') {
      // tryng to jump next
      willGoToMaterialUuid = currentLesson.materials[index + 1]
    } else if (typeof currentLesson.materials[index - 1] !== 'undefined') {
      // tryng to jump prev
      willGoToMaterialUuid = currentLesson.materials[index - 1]
    }

    $.ajax({
      async: true,
      url: API_PREFIX + 'materials/' + uuid + '/',
      method: 'DELETE',
      success: function(data, status, jqXHR) {
        dispatch({
          type: ActionTypes.DELETE_MATERIAL,
          material: uuid,
          lesson: state.materials[uuid].lesson,
        })
        dispatch(goToMaterial(willGoToMaterialUuid, currentLesson.uuid))
      },
    })
  }
}

// TODO convert to updateMaterial (see above)?
export function updateMaterialImage(materail, canvas) {
  return (dispatch, state) => {
    let data = new window.FormData()
    canvas.toBlob(function(blob) {
      data.append('screenshot', blob, 'screenshot.png')
      getAxios()
        .patch(`${API_PREFIX}materials/${materail.uuid}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          dispatch(materialLoaded(response.data))
        })
        .catch(error => {
          console.log(error.response)
        })
    })
  }
}

export function foundUsersLoaded(data) {
  return {
    type: ActionTypes.FOUND_USERS_LOADED,
    foundUsers: data,
  }
}

export function findUserRequest(data) {
  return {
    type: ActionTypes.FOUND_USERS_REQUEST,
    findUserRequest: data,
  }
}

export function findUsers(searchString) {
  return (dispatch, getState) => {
    dispatch(findUserRequest(true))
    $.ajax({
      url: API_PROFILE_PREFIX + 'find?q=' + searchString,
      type: 'GET',
      success: function(data, status, jqXHR) {
        dispatch(foundUsersLoaded(data))
        dispatch(findUserRequest(false))
      },
    })
  }
}

export function coursesNavigationLoaded(data) {
  return {
    type: ActionTypes.COURSE_NAVIGATION_COURSES_LOADED,
    courses: data,
  }
}

export function unitsNavigationLoaded(data) {
  return {
    type: ActionTypes.COURSE_NAVIGATION_UNITS_LOADED,
    units: data,
  }
}

export function modulesNavigationLoaded(data) {
  return {
    type: ActionTypes.COURSE_NAVIGATION_MODULES_LOADED,
    modules: data,
  }
}

export function moduleNavigationLoaded(data) {
  return {
    type: ActionTypes.COURSE_NAVIGATION_LESSONS_LOADED,
    lessons: extract(data, 'lessons'),
  }
}

export function loadNavigationCourses() {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'courses/',
      context: this,
      success: function(data, status, jqXHR) {
        dispatch(coursesNavigationLoaded(data))

        // extract all units from all courses, not so good.
        const units = extractAll(data, 'units')
        dispatch(unitsNavigationLoaded(units))

        // extract all modules from all units, not so good.
        var modules = extractAll(units, 'modules')
        dispatch(modulesNavigationLoaded(modules))
      },
    })
  }
}

export function loadNavigationModule(uuid) {
  return function(dispatch) {
    $.ajax({
      async: true,
      url: API_PREFIX + 'modules/' + uuid + '/',
      success: function(data, status, jqXHR) {
        dispatch(moduleNavigationLoaded(data))
      },
    })
  }
}

//// TODO remove
// export function answerLoaded (data) {
//   return {
//     type: ActionTypes.ANSWER_LOADED,
//     answer: data
//   }
// }

// export function loadAnswer (uuid) {
//   return function (dispatch) {
//     $.ajax({
//       url: API_PREFIX + 'answers/' + uuid + '/',
//       type: 'GET',
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function changeAnswerText (uuid, newText) {
//   return function (dispatch) {
//     $.ajax({
//       url: API_PREFIX + 'answers/' + uuid + '/',
//       type: 'PATCH',
//       data: {text: newText},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function changeAnswerMYSQL (uuid, schemaSQL, querySQL) {
//   return function (dispatch) {
//     $.ajax({
//       url: API_PREFIX + 'answers/' + uuid + '/',
//       type: 'PATCH',
//       data: {schema_SQL: schemaSQL, query_SQL: querySQL},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       },
//       error: function (data) {
//         if (data.status === 400) {
//           // TODO rewrite with embededd message
//           let errorMessage = null
//           if (data.responseJSON.hasOwnProperty('schema_SQL')) {
//             errorMessage = data.responseJSON.schema_SQL
//           } else if (data.responseJSON.hasOwnProperty('query_SQL')) {
//             errorMessage = data.responseJSON.query_SQL
//           }
//           if (errorMessage) { alert(errorMessage) }
//           // reload answer due validation error
//           dispatch(loadAnswer(uuid))
//         }
//       }
//     })
//   }
// }

// export function changeAnswerImage (uuid, image) {
//   return dispatch => {
//     let formData
//     if (image) {
//       formData = new FormData()
//       formData.append('image', image)
//
//       $.ajax({
//         url: API_PREFIX + 'answers/' + uuid + '/',
//         type: 'PATCH',
//         processData: false,
//         contentType: false,
//         data: formData,
//         success: function (data) {
//           dispatch(answerLoaded(data))
//         }
//       })
//     } else {
//       formData = {'image': image}
//       $.ajax({
//         url: API_PREFIX + 'answers/' + uuid + '/',
//         type: 'PATCH',
//         data: formData,
//         success: function (data) {
//           dispatch(answerLoaded(data))
//         }
//       })
//     }
//   }
// }

// export function answerAdded (answer) {
//   return {
//     type: ActionTypes.ANSWER_ADDED,
//     answer: answer
//   }
// }
//
// export function addAnswer (materialUuid) {
//   return dispatch => {
//     $.ajax({
//       async: true,
//       url: API_PREFIX + 'answers/',
//       method: 'POST',
//       data: {text: 'New answer', material: materialUuid},
//       success: function (data, status, jqXHR) {
//         dispatch(answerAdded(data))
//       }
//     })
//   }
// }

// export function deleteAnswerChoice (answerUuid) {
//   return (dispatch, getState) => {
//     var state = getState().studio
//     var materialUuid = state.answers[answerUuid].material
//     dispatch({
//       type: ActionTypes.DELETE_ANSWER,
//       materialUuid: materialUuid,
//       uuid: answerUuid
//     })
//     $.ajax({
//       async: true,
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       method: 'DELETE',
//       success: function (data, status, jqXHR) {
//         //
//       }
//     })
//   }
// }

// export function setAnswerIsCorrect (answer, is_correct, exclusive) {
//   return dispatch => {
//     $.ajax({
//       async: true,
//       url: API_PREFIX + 'answers/' + answer + '/',
//       method: 'PATCH',
//       data: {is_correct: is_correct},
//       success: function (data, status, jqXHR) {
//         if (exclusive) {
//           dispatch({
//             type: ActionTypes.SET_ANSWER_EXCLUSIVELY_CORRECT,
//             answer: answer
//           })
//         } else {
//           dispatch({
//             type: ActionTypes.SET_ANSWER_IS_CORRECT,
//             answer: answer,
//             is_correct: is_correct
//           })
//         }
//       }
//     })
//   }
// }

// export function changeAnswerRepresentation (answerUuid, newRepresentation) {
//   return dispatch => {
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {representation: newRepresentation},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateVectorAnswerComponents (answerUuid, x_component, y_component) {
//   return (dispatch, getState) => {
//     var update
//     var ans = getState().studio.answers[answerUuid]
//     if (ans.angle != null) {
//       update = {
//         angle: vectorToAngle(x_component, y_component),
//         x_component: null,
//         y_component: null
//       }
//     } else if (ans.magnitude != null) {
//       update = {
//         magnitude: Math.sqrt(x_component * x_component + y_component * y_component),
//         angle: null,
//         x_component: null,
//         y_component: null
//       }
//     } else {
//       update = {
//         angle: null,
//         x_component: x_component,
//         y_component: y_component
//       }
//     }
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: update,
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateVectorCheckType (answerUuid, newType) {
//   return (dispatch, getState) => {
//     var update
//     var ans = getState().studio.answers[answerUuid]
//     if (newType === 'angle') {
//       update = {
//         x_component: null,
//         y_component: null,
//         angle: ans.angle || vectorToAngle(ans.x_component, ans.y_component) || 0,
//         magnitude: null
//       }
//     } else if (newType === 'full') {
//       var x, y
//       if (ans.angle != null) {
//         [x, y] = angleToVector(ans.angle)
//       } else {
//         x = ans.magnitude
//         y = 0
//       }
//       update = {
//         x_component: ans.x_component || x,
//         y_component: ans.y_component || y,
//         angle: null,
//         magnitude: null
//       }
//     } else if (newType === 'magnitude') {
//       var magnitude = 1
//       if (ans.x_component) {
//         magnitude = Math.sqrt(ans.x_component * ans.x_component + ans.y_component * ans.y_component)
//       }
//       update = {
//         x_component: null,
//         y_component: null,
//         angle: null,
//         magnitude: magnitude
//       }
//     }
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: update,
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateUnitConversionType (answerUuid, newType) {
//   return dispatch => {
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {'unit_conversion_type': newType},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateUnitConversionMaterialValue (answerUuid, newValue) {
//   return dispatch => {
//     if (!validateQuantityUnit(newValue)) {
//       return
//     }
//     var quantity, unit;
//     [quantity, unit] = splitQuantityUnit(newValue)
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {
//         'material_number': quantity,
//         'material_unit': unit
//       },
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateUnitConversionAnswerValue (answerUuid, newValue) {
//   return dispatch => {
//     if (!validateQuantityUnit(newValue)) {
//       return
//     }
//     var quantity, unit;
//     [quantity, unit] = splitQuantityUnit(newValue)
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {
//         'answer_number': quantity,
//         'answer_unit': unit
//       },
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function updateUnitConversionStep (answerUuid, stepIndex, update) {
//   return (dispatch, getState) => {
//     for (var k in update) {
//       if (!validateQuantityUnit(update[k])) {
//         return
//       }
//       update[k] = splitQuantityUnit(update[k]).join('\\ ')
//     }
//     var steps = getState().studio.answers[answerUuid].conversion_steps.map(step => Object.assign({}, step))
//     Object.assign(steps[stepIndex], update)
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {'conversion_steps': JSON.stringify(steps)},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function addConversionStep (answerUuid) {
//   return (dispatch, getState) => {
//     var steps = getState().studio.answers[answerUuid].conversion_steps.map(step => Object.assign({}, step))
//     steps.push({numerator: '', denominator: ''})
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {'conversion_steps': JSON.stringify(steps)},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function removeConversionStep (answerUuid) {
//   return (dispatch, getState) => {
//     var steps = getState().studio.answers[answerUuid].conversion_steps.map(step => Object.assign({}, step))
//     steps.pop()
//     $.ajax({
//       url: API_PREFIX + 'answers/' + answerUuid + '/',
//       type: 'PATCH',
//       data: {'conversion_steps': JSON.stringify(steps)},
//       success: function (data, status, jqXHR) {
//         dispatch(answerLoaded(data))
//       }
//     })
//   }
// }

// export function clearMaterialVectors (uuid) {
//   return dispatch => {
//     $.ajax({
//       url: API_PREFIX + 'materials/' + uuid + '/',
//       type: 'PATCH',
//       data: {'vectors': '[]'},
//       success: function (data, status, jqXHR) {
//         dispatch(materialLoaded(data))
//       }
//     })
//   }
// }

// export function addMaterialVector (uuid, x_component, y_component) {
//   return (dispatch, getState) => {
//     var s = getState().studio
//     var vectors = s.materials[uuid].vectors.slice()
//     vectors.push({
//       x_component: x_component,
//       y_component: y_component
//     })
//     $.ajax({
//       url: API_PREFIX + 'materials/' + uuid + '/',
//       type: 'PATCH',
//       contentType: 'application/json; charset=utf-8',
//       dataType: 'json',
//       data: JSON.stringify({'vectors': vectors}),
//       success: function (data, status, jqXHR) {
//         dispatch(materialLoaded(data))
//       }
//     })
//   }
// }
