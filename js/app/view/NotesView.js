var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.NoteView = Backbone.View.extend({
    tagName: 'li',

    //initialize: function() {
    //  this.model.on('destroy', this.remove, this);
    //},
    //events: {"deleteEvent": "deleteNote"},
    //deleteNote: function() {
    //  if (confirm('are you sure?')) {
    //    console.log("DEBUG");
    //    this.model.destroy();
    //  } else {
    //    console.log("FALSE");
    //  }
    //},
    //remove: function() {
    //  this.$el.remove();
    //},

    template: _.template( $('#note-view').html() ),
    render: function() {
      this.el.id = this.model.toJSON().noteid;
      var template = this.template( this.model.toJSON() );
      this.$el.html(template);
      return this;
    }
});

com.apress.view.NotesView = Backbone.View.extend({
  tagName: 'ul',
  id: 'notelist',
  render: function() {
    this.collection.each(function(note) {
      var noteView = new com.apress.view.NoteView({ model: note });
      this.$el.append(noteView.render().el);
    }, this);
    return this;
  }
});

