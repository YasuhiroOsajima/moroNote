var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};

com.apress.model.Folder = Backbone.Model.extend({
  defaults: {
    folderid: '',
    name: '',
    parentfolderid: '',
    sortname: ''
  }
});
