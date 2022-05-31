var _ = require('lodash')

module.exports = function loadOption (name, packageJson) {
  if (envVarSet(posixEnvVarName(name))) {
    return boolEnvVarValue(posixEnvVarName(name))
  } else if (envVarSet(packageEnvVarName(name))) {
    return boolEnvVarValue(packageEnvVarName(name))
  } else if (envVarSet(packageEnvConfigVarName(name))) {
    return boolEnvVarValue(packageEnvConfigVarName(name))
  } else if (envVarSet(packageArrayEnvVarName(name))) {
    return arrayEnvVarValue(packageEnvVarName(name))
  } else if (packageVar(name, packageJson)) {
    return boolPackageVarValue(name, packageJson)
  }
}

function boolEnvVarValue (envVarName) {
  var value = process.env[envVarName]

  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else {
    return value
  }
}

function arrayEnvVarValue (envVarName) {
  var count = 0
  var result = []

  while (envVarSet(envVarName + '_' + count)) {
    result.push(process.env[envVarName + '_' + count])
    count++
  }

  return result
}

function boolPackageVarValue (optionName, packageJson) {
  let value
  if (packageJson && packageJson.scripty && packageJson.scripty[optionName]) {
    value = packageJson.scripty[optionName]
  } else if (packageJson && packageJson.config) {
    const scriptyConfig = packageJson.config.scripty
    if (scriptyConfig && scriptyConfig[optionName]) {
      value = scriptyConfig[optionName]
    }
  }

  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else {
    return value
  }
}

function envVarSet (envVarName) {
  return !!process.env[envVarName]
}

function packageVar (optionName, packageJson) {
  if (!packageJson) {
    return false
  }
  if (packageJson.scripty && packageJson.scripty[optionName]) {
    return !!packageJson.scripty[optionName]
  } else if (packageJson.config) {
    const scriptyConfig = packageJson.config.scripty
    if (scriptyConfig && scriptyConfig[optionName]) {
      return !!scriptyConfig[optionName]
    }
  }
}

function posixEnvVarName (optionName) {
  return 'SCRIPTY_' + _.snakeCase(optionName).toUpperCase()
}

function packageEnvVarName (optionName) { // Backwards compatible for npm v6
  return 'npm_package_scripty_' + optionName
}

function packageEnvConfigVarName (optionName) {
  return 'npm_package_config_scripty_' + optionName
}

function packageArrayEnvVarName (optionName) {
  return packageEnvVarName(optionName) + '_0'
}
