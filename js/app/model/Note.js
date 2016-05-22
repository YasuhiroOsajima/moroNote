var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};

com.apress.model.Note = Backbone.Model.extend({
  defaults: {
    noteid: '',
    title: '',
    folderid: '',
    updated_at: ''
  }
});
