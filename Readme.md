# Create an empty workspace, apps and packages

1. Check the sdk by listing the paths:
> `sencha config --prop sencha.sdk.path --list`

2. Create a workspace in a folder named `empty_ws`:
> `sencha generate workspace empty_ws`

3. Within the root folder of your workspace, execute the following to add the new framework. This creates a folder named `ext` under the `skds` folder in the workspace with a key name `ext`.
> `sencha framework add -key ext -source /Users/ipek/Documents/workspace/sencha/sdks/ext -path sdks/ext` 
  
4. Once you have a Workspace, generating apps can be done as before but using the `"ext" folder` in the workspace:
> `sencha -sdk ./sdks/ext generate app UniversalApp universal-app`

OR

> `sencha -sdk ./sdks/ext generate app --universal UniversalApp universal-app`

   1. By default, this application will be a Universal Application.
   2. `universal-app` will be the `folder name`.
   3. `UniversalApp` will be the `app name` and `app namespace`.
   4. The generated app is built immediately.

4.1. Alternatively, the `--ext` switch can be used to pick the "ext" framework from the workspace without worrying about its path:
> `sencha generate app -ext --classic ClassicApp classic-app`

> `sencha generate app -ext --modern ModernApp modern-app`

1. Add a new package
> `sencha generate package core`

With this command a local package named `core` is created under the *packages\local\core*.

# Building the app
Internally, the `sencha app build` command does basic validation and calls in to the Apache Ant build script found in `"build.xml"` at the root of the application. Specifically, it calls the `"build" target` of this script. This means the entire build process can be examined, extended and (if necessary) even modified.

Most aspects of the build script behind `sencha app build` are controlled by properties as is typical of Ant. 
In this case there are two kinds of properties: `configuration properties` and `build properties`.

## Configuration Properties
**Sencha Cmd configuration properties** are available to the build script but also drive many other features of Sencha Cmd (like the compiler). 

To see the current set of configuration properties, run this command:
> `sencha diag show`
```
[INF]                     buildenvironment.dir : /Users/ipek/Documents/workspace/sencha/empty_ws   
[INF]                buildenvironment.load.dir : /Users/ipek/Documents/workspace/sencha/empty_ws   
[INF]                           cmd.config.dir : /Users/ipek/bin/Sencha/Cmd/6.7.0.63               
[INF]                                  cmd.dir : /Users/ipek/bin/Sencha/Cmd/6.7.0.63               
[INF]               cmd.merge.tool.args.araxis : -wait -merge -3 -a1 {base} {user} {generated} {out}
[INF]               cmd.merge.tool.args.kdiff3 : {base} {user} {generated} -o {out}                
[INF]              cmd.merge.tool.args.p4merge : {base} {user} {generated} {out}                   
[INF]            cmd.merge.tool.args.smartsync : {user} {generated} {base}                         
[INF]           cmd.merge.tool.args.sourcegear : --merge --result={out} {user} {base} {generated}  
[INF]             cmd.merge.tool.args.tortoise : -base:{base} -theirs:{generated} -mine:{user} -merged:{out}
[INF]                               cmd.minver : 3.0.0.0                                           
[INF]                             cmd.platform : osx                                               
[INF]                      cmd.unicode.escapes : /Users/ipek/bin/Sencha/Cmd/6.7.0.63/unicode-escapes.json
[INF]                              cmd.version : 6.7.0.63                                          
[INF]                             cmd.web.port : 1841                                              
[INF]                        inspector.address : http://localhost:1839/                            
[INF]                           repo.local.dir : /Users/ipek/bin/Sencha/Cmd/repo                   
[INF]                          sencha.sdk.path : /Users/ipek/Documents/workspace/sencha/sdks       
[INF]                        shared.sencha.dir : true                                              
[INF]         system.java.net.useSystemProxies : true                                              
[INF]                           workspace.apps : universal-app,classic-app,modern-app              
[INF]                         workspace.apps.0 : universal-app                                     
[INF]                         workspace.apps.1 : classic-app                                       
[INF]                         workspace.apps.2 : modern-app                                        
[INF]                    workspace.apps.length : 3                                                 
[INF]                      workspace.build.dir : /Users/ipek/Documents/workspace/sencha/empty_ws/build
[INF]                     workspace.config.dir : /Users/ipek/bin/Sencha/Cmd/6.7.0.63/ant/build/workspace
[INF]                            workspace.dir : /Users/ipek/Documents/workspace/sencha/empty_ws   
[INF]            workspace.frameworks.ext.path : /Users/ipek/Documents/workspace/sencha/empty_ws/sdks/ext
[INF]         workspace.frameworks.ext.version : 6.7.0.161                                         
[INF]                   workspace.packages.dir : /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local,/Users/ipek/Documents/workspace/sencha/empty_ws/packages                                      
[INF]               workspace.packages.extract : /Users/ipek/Documents/workspace/sencha/empty_ws/packages/remote
```

## Build Properties
`The build script` defines many other properties that are specific to builds. These build properties are typically prefixed by "build.".

To see the current values of these you can run this command from your app folder:
> `cd modern-app/`

> `sencha ant .props`

```
[INF] [echoproperties] #Ant properties   
[INF] [echoproperties] #Tue Apr 16 10:16:46 EEST 2019  
.......   
[INF] [echoproperties] app.dir=/Users/ipek/Documents/workspace/sencha/empty_ws/modern-app   
[INF] [echoproperties] app.environment=production   
.......   
[INF] [echoproperties] app.loader.cache=false   
[INF] [echoproperties] app.loader.cacheParam=_dc   
[INF] [echoproperties] app.manifest.bootstrap=bootstrap.json   
[INF] [echoproperties] app.manifest.name=app.json
[INF] [echoproperties] app.microloader=/Users/ipek/bin/Sencha/Cmd/6.7.0.63/ant/build/app/Microloader.js   
[INF] [echoproperties] app.microloader.bootstrap=/Users/ipek/bin/Sencha/Cmd/6.7.0.63/ant/build/app/Microloader.js   
[INF] [echoproperties] app.microloader.development=development.js   
[INF] [echoproperties] app.microloader.dir=/Users/ipek/bin/Sencha/Cmd/6.7.0.63/ant/build/app   
[INF] [echoproperties] app.microloader.name=Microloader.js   
[INF] [echoproperties] app.microloader.path=/Users/ipek/bin/Sencha/Cmd/6.7.0.63/ant/build/app/Microloader.js   
.......   
[INF] [echoproperties] app.production.cache.enable=true   
[INF] [echoproperties] app.production.compressor.type=yui   
[INF] [echoproperties] app.production.loader.cache=$'{'build.timestamp'}'   
[INF] [echoproperties] app.production.output.appCache.enable=true   
[INF] [echoproperties] app.production.output.appCache.path=cache.appcache   
[INF] [echoproperties] app.resources.dir=/Users/ipek/Documents/workspace/sencha/empty_ws/modern-app/resources   
.......   
[INF] [echoproperties] app.toolkit=modern   
[INF] [echoproperties] app.version=1.0.0.0   
.......   
```

### Setting Build Properties
There are many ways to *configure build properties*. The simplest way is to edit one of the build properties files. To decide which file to edit it is helpful to know the priority of each of these files and under what conditions they are loaded.

- `"local.properties"` -- If present, this file is loaded first. This file is intended to be applied only locally (to the local machine). It should not be committed to source control to be used by others. These settings take priority over any properties defined in other properties files as well as the current configuration properties.

- Sencha Cmd configuration properties

- `".sencha/app/${build.environment}.properties"`
  ".sencha/app/native.properties"
  ".sencha/app/package.properties"
  ".sencha/app/production.properties"
  ".sencha/app/testing.properties"

- `".sencha/app/build.properties"`    
    - => ⁨Users⁩/ipek⁩/bin⁩/Sencha⁩/Cmd⁩/6.7.0.63⁩/ant⁩/build⁩/app⁩/build.properties
- `".sencha/app/defaults.properties"`
    - => Users⁩/ipek⁩/bin⁩/Sencha⁩/Cmd⁩/6.7.0.63⁩/ant⁩/build⁩/app⁩/defaults.properties

# Building a package

Go to the package directory and run:
> `sencha package build`

1. If a package is empty (does not have any toolkit, theme, or `ext` framework dependency) build will succeed.
```
kmac:utils ipek$ sencha package build
Sencha Cmd v6.7.0.63
[INF] Processing Build Descriptor : default
[INF] Loading compiler context
[INF] Processing data with ClosureCompressor
[INF] JavaScript input level is NEXT and output level is ES5
[INF] Writing concatenated output to file /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build/utils-debug.js
[INF] Processing data with CmdJavascriptCompressor
[INF] JavaScript input level is NEXT and output level is ES5
[INF] Writing concatenated output to file /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build/utils.js
[INF] merging 1 input resources into /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build/resources
[INF] merged 1 resources into /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build/resources
[INF] merging 0 input resources into /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build
[INF] merged 0 resources into /Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/build
[INF] Processing examples in "/Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/examples" (/Users/ipek/Documents/workspace/sencha/empty_ws/packages/local/utils/examples)
```

1. If a package is not empty  but does not have any toolkit, theme dependency we have to make following changes:
   1. Remove sass folder
   2. Modify package.json:
      - Add "framework": "ext"
      - Set "slicer": null
      - Set "sass" : null
      - Add to `ext` and `core` to the requires array:
          "requires": [
            "ext",
            "core"
          ]

3. If not, following changes needed to be made in the `package.json` before building a package independently:
```json
{
    "name": "@<corporation>/<PACKAGE_NAME>",
    "version": "2.0.0.0",
    "sencha": {
        "name": "<PACKAGE_NAME>",
        "namespace": "<YOUR_NAMESPACE>",
        "type": "code",
        "alternateName": [
            "<IF_IT_IS_ALTERNATE_NAME>"
        ],
        "framework": "ext", //Must match with ext name in your workspace
        "toolkit": "classic", //WITHOUT THIS EXT MODULE IS MISSING
        "theme": "theme-triton", // MANDATORY WITHOUT THIS CORE MODULE NOT COMPILE
        "requires": [
            "ext",
            "core",
            "ux"
        ],
        "creator": "<YOUR NAME>",
        "summary": "<YOUR SUMMARY>",
        "detailedDescription": "<YOUR SUMMARY>",
        "version": "6.5.0", 
        "compatVersion": "6.5.0",
        "format": "1",
        "sass": {
            "namespace": "<YOUR_NAMESPACE>",
            "etc": [
                "${package.dir}/sass/etc/all.scss",
                "${package.dir}/${toolkit.name}/sass/etc/all.scss"
            ],
            "var": [
                "${package.dir}/sass/var",
                "${package.dir}/${toolkit.name}/sass/var"
            ],
            "src": [
                "${package.dir}/sass/src",
                "${package.dir}/${toolkit.name}/sass/src"
            ]
        },
        "output": {
            "base": "${package.dir}/build",
            "js": "..",
            "sass": ""
        },
        "local": true,
        "classpath": [
            "${package.dir}/src",
            "${package.dir}/${toolkit.name}/src"
        ],
        "overrides": [
            "${package.dir}/overrides",
            "${package.dir}/${toolkit.name}/overrides"
        ],
        "slicer": {
            "js": [
                {
                    "path": "${package.dir}/sass/example/custom.js",
                    "isWidgetManifest": true
                }
            ]
        }
    }
}
```

# Changing the place of generated files for develeopment (move them under the folder named 'generatedFiles')

- In app.json, make the following changes:
```json
    "bootstrap": {
        "base": "${app.dir}",
        
        "manifest": "generatedFiles/bootstrap.json",
        "microloader": "generatedFiles/bootstrap.js",
        "css": "generatedFiles/bootstrap.css"
    },
```
Do not make the same changes for the `"output"` entry which affects the **production** build.

- In index.html, add *generatedFiles* path to access the new location of generated bootstrap.js:
```html
<script id="microloader" data-app="e7018031-9938-41da-a115-a7dd540f9a6d" type="text/javascript" src="generatedFiles/bootstrap.js"></script> 
```
# Move production builds to our local Sites folder:

- Change/Add the **"base"** entry as the following:

```json
    /**
     * Settings specific to production builds.
     */
    "production": {
        "output": {
            "base": "/Users/ipek/Sites/sencha/${app.name}",
            "appCache": {
                "enable": false,
                "path": "cache.appcache"
            }
```

# Application Folder structures

## Cmd Apps

### Classic/Modern
    /${app.name}  
      /app  
        /model
        /store
        /view
        Application.js
        Application.scss
      
      /resources

    app.js
    app.json

### Universal
    /${app.name}  
      /app  
        /model
        /store
        /view
        Application.js
        Application.scss
      
      /resources

      /classic
        /resources
        /src

      /modern
        /resources
        /src

    app.js
    app.json

## Open Tooling Apps

Open tooling apps, even though they have one build profile, they have this profile defined in the `builds` configuration of `app.json`.

It seems like, even though an app is generated as having a one toolkit or one platform, it is structurally more ready to be extended to add another toolkit/platform.

### Classic/Modern
    /${app.name}
      /app
        /desktop
          /src
            /model
            /store
            /view
            /util
            Application.js
            Application.scss

          /sass
            src.scss
            var.scss
          
          /overrides

        /shared
          /src
            /model
            /store
            /view
            /util

          /sass
            src.scss
            var.scss
          
          /overrides
      
      /resources

    app.js
    app.json

### Universal
    /${app.name}
      /app
        /desktop
          /src
            /model
            /store
            /view
            /util
            Application.js
            Application.scss

          /sass
            src.scss
            var.scss
          
          /overrides

        /phone
          /src
            /model
            /store
            /view
            /util
            Application.js
            Application.scss

          /sass
            src.scss
            var.scss
          
          /overrides

        /shared
          /src
            /model
            /store
            /view
            /util

          /sass
            src.scss
            var.scss

          /overrides
      
      /resources
        /desktop
        /phone
        /shared

    app.js
    app.json

# Inner Workings of Sencha Cmd

## Microloader

Dynamic loader for JS and CSS

### The Manifest
- `app.json`: Sencha Cmd transforms the content of `app.json` and passes on the resulting manifest to the Microloader to use at runtime. Lastly, Ext JS itself also consults the runtime manifest for configuration options.

- `Ext.manifest`
When you launch your application, you will find the **processed content of "app.json"** loaded as `Ext.manifest`.

- The `script` Tag
To use the Microloader, your page will need to contain the following `script` tag:
```html
<script id="microloader" data-app="12345" type="text/javascript" src="bootstrap.js"></script>
```
By default, this `script` tag **will be replaced** by the build process but is used **during development** to load the application. 
The **data-app** atrribute should have been generated for you during app scaffold. This is a unique ID used in local storage to prevent data collision.

#### `app.json` Defaults and Customization

- indexHtmlPath
This is the path to the application's HTML document (relative to the "app.json" file). By default this property is set to "index.html". If you server uses PHP, ASP, JSP or other technology, you can change this value to point at the proper file like so:
  `indexHtmlPath": "../page.jsp`

If you change this setting, you will likely also need to change your "output" options (see below).

#### `js`
An array of **descriptions of JavaScript code files to load**. By default, an Ext JS 6 application will have something like this:
```json
"js": [{
    "path": "app.js",
    "bundle": true
}]
```

This entry specifies your application's **entry point**. The `bundle` flag indicates that when you run `sencha app build`, this entry should be replaced by **the concatenated output of the build**. You can add other files to this array like so:
```json
"js": [{
    "path": "library1.js"
    // "remote": false (defaults)
},{
    "path": "library2.js",
    "remote": true
},{
    "path": "library3.js",
    "includeInBundle": true
},{
    "path": "app.js",
    "bundle": true
}]
```
- `"library1.js"` would be assumed to **reside in your app folder** and **would then be copied to the build output folder**. The entry would remain in the manifest and be **loaded separately by the Microloader**.

- To simply pass along the entry for the Microloader to load (and **not be copied** by the build process), add the "remote" property like for `"library2.js"`:

- `"library3.js"` will be included in **the concatenated build output** and *removed from the runtime manifest*.

**Note:** While you can add entries to this array, most dependencies will appear in `"requires"` statements in your code or in `requires` array in "app.json"  

- "path": "path/to/script.js"  
Path to file. If the file is local this must be a relative path from this app.json file.

- "bundle": false  
Set to true on one file to indicate that it should become the container for the concatenated classes.

- "includeInBundle": false  
Set to true to include this file in the concatenated classes.

- "remote": false  
Specify as true if this file is remote and should not be copied into the build folder. Defaults to false for a local file which will be copied.

- "bootstrap": false  
A value of true indicates that is a **development mode only** dependency.  
These files will not be copied into the build directory or referenced in the generate app.json manifest for the microloader.

- "update": ""  
If not specified, this file will only be loaded once, and cached inside `localStorage` until this value is changed. You can specify:  
    - "delta" to enable over-the-air delta update for this file
    - "full" means full update will be made when this file changes

**Examples:**
- Cmd Classic/Modern
```json
"classpath": [
    "app"
],
```
- Cmd Universal  
```json
"classpath": [
    "app",
    "${toolkit.name}/src" // To include /classic/src
],
```

#### `css`
Your CSS assets are handled slightly different than JavaScript. This is because in a stock Sencha Cmd application, **CSS is compiled from the `.scss` source**. The initial content of the "css" property looks something like this:
```json
"css": [{
    "path": "boostrap.css",
    "bootstrap": true
}],
```
- This CSS file is a simple stub that **imports a build** of your `"sass"` folder.
- The `"bootstrap"` flag indicates that the entry is used **for development** but **should be removed from build output**. 
- For a build, the **compiled CSS** file will be appended to the `"css" array` of the generated manifest.

In an empty app, "bootstrap.css" imports the theme from the framework and looks something like this:
`@import "..../ext-theme-neptune/build/ext-theme-neptune-all.css";`

As you *build your app*, this file is updated to point at the **most recently built CSS file**. For example if you run `sencha app build`, the **production CSS file** will be *imported by "bootstrap.css"* like so:  
`@import "..../build/..../app-all.css";`

**My Note:**
This doesn't seem true: production build has nothing to do with the update of *bootstrap.css*. Development build updates the *bootstrap.css*

