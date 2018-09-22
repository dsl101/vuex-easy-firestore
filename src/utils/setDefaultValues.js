import { isObject, isFunction, isString, isDate } from 'is-what'
import merge from 'merge-anything'
import findAndReplace from 'find-and-replace-anything'

// convert to new Date() if defaultValue == '%convertTimestamp%'
function convertTimestamps (originVal, targetVal) {
  if (originVal === '%convertTimestamp%') {
    // firestore timestamps
    if (isObject(targetVal) && isFunction(targetVal.toDate)) {
      return targetVal.toDate()
    }
    // strings
    if (isString(targetVal) && isDate(new Date(targetVal))) {
      return new Date(targetVal)
    }
  }
  return targetVal
}

export default function (obj, defaultValues) {
  if (!isObject(defaultValues)) console.error('Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues)
  if (!isObject(obj)) console.error('Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues)
  const result = merge({extensions: [convertTimestamps]}, defaultValues, obj)
  return findAndReplace(result, '%convertTimestamp%', null)
}
