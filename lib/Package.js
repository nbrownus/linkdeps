var path = require('path')
  , fs = require('fs')

/**
 * Helper for getting package information
 *
 * @param {String} packageDir Directory that contains the package.json file
 *
 * @constructor
 */
var Package = function (packageDir) {
    //TODO: Make sure path isn't a symlink?
    this.path = path.normalize(packageDir)
    this.json = require(path.join(this.path, 'package.json'))
    this.dependencies = {}

    this._gatherDependencies()
}

module.exports = Package

Package.prototype._gatherDependencies = function () {
    var self = this

    if (!self.json.dependencies) {
        return
    }

    Object.keys(self.json.dependencies).forEach(function (name) {
        self.dependencies[name] = new Package(self._getDependencyPath(self.path, name))
    })
}

Package.prototype._getDependencyPath = function (checkPath, name) {
    //TODO: Check if we have a better version already that matches our semver

    while (true) {
        var tempPath = path.join(checkPath, 'node_modules', name)
        if (fs.existsSync(tempPath)) {
            return tempPath
        }

        tempPath = path.resolve(checkPath, '..')
        if (tempPath === checkPath) {
            break
        }
        checkPath = tempPath
    }

    return false
}
