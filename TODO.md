
refactor(assets): into agnostic list of "attributes"

- refactor into an array:

    ex: attributes: [{name: 'bower.json', value: {id: ..., data: ...}, {name: 'docs', url: 'http://...'}]

- attribute types

    ex: ATTRIBUTES: {'bower.json': { type: 'package' }, 'docs': { type: 'ref' }, ... }
    // available attributes can be read from Object.keys(ATTRIBUTES)



feat(attributes): as a user I want to add/remove attributes from a project

- create client/server agnostic models for attributes (with properties, defaults, validation)

- edit project form
    - attribute picker (attrs available and not yet in use)
    - attribute editor, map attribute name to directive and manually compile it



feat(packages): persist bower and package as attributes of project

    ex: project.attributes.bower = {id: ..., data: ...}



feat(build-on-demand): schedule (generate/persist job id, publish to que, runs on consumer worker)

- investigate build
- investigate hulot
- investigate "build on travis, collect logs"



feat(build-progress): show progress (client subscribes via socket, bk subscribes to broker topic, offline worker publishes progress)




refactor(versions): move out of project into to own collection

- project keeps name, description, tags
- allows storing a lot of data per version)
- id can be composed of project.id + tag
- project.currentVersionTag becomes project.currentVersion


feat(versions): as an admin I want to create a version using another version (typically master) as a base

- basically, cloning the "current version" when "releasing" a new one, but anything could go here


feat(versions): as a user I want to see the details of a previous (or future) version

- meaning a version that is not the current one
- from project main page (currentVersion) link to /project/:id/v/:tag
- same template, highlighting the fact that this is NOT the "current version"


feat(versions-tags)

- add tags to versions
- ex: 'old version', 'not supported', 'experimental'
- no need to highlight "non-current" versions anymore


feat(attribute-templates): template auto attributes

- urls in atributes can have a default (explore templates instead)
  which is cool if you want to update all VERSIONS when something like project.id or bower.user changes.
  But what if you want to keep URLs in old versions (all or some of them) pointing to where they are?

- explore using templates in attribute values ex: "http://travis-ci.org/{travis.user}/{project.id}"
  - API methods should always render all attributes
  - unless requested not too (edit page requires that)
  - need client/server agnostic code to parse/render these templated URLs

- explore having a FREEZE button per version (per attribute?) that converts the template into value
- explore flagging these attributes as "freezed" to disable editing/posting


feat(build-logs): in realtime, collect logs, persist in ProjectVersion, relay logs to client


feat(build-size): collect build/vendors size, store in ProjectVersion, display in projectVersion

- experiment different auditing strategies for bower/browser/npm deps

