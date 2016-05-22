var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.FolderView = Backbone.View.extend({
    tagName: 'li',
    className: 'closed',

    //initialize: function() {
    //  this.model.on('destroy', this.remove, this);
    //},
    //events: {
    //  "deleteEvent": "deleteFolder",
    //},
    //deleteFolder: function() {
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

    template: _.template( $('#folder-view').html() ),
    render: function() {
      this.el.id = this.model.toJSON().folderid;
      var template = this.template( this.model.toJSON() );
      this.$el.html(template);
      return this;
    }
});

com.apress.view.FolderTreeView = Backbone.View.extend({
  tagName: 'ul',
  id: 'foldertree',
  className: 'treeview-famfamfam',
  topfolders: [],
  untopfolders: [],

  render: function() {
    this.collection.each(function(folder) {
      if (folder.toJSON().parentfolderid == '') {
        this.topfolders.push(folder);
      } else {
        this.untopfolders.push(folder);
      }
    }, this);

    this.collection.each(function(folder) {
      var folderView = new com.apress.view.FolderView({ model: folder });

      if (this.topfolders.indexOf(folder) >= 0)  {
        this.$el.append(folderView.render().el);
      }
    }, this);

    do {
      this.collection.each(function(folder) {
        parentfolderid = folder.toJSON().parentfolderid;
        if (parentfolderid && this.untopfolders.indexOf(folder) >= 0) {
          parentfolder = this.$el.find('#'+parentfolderid);

          if (parentfolder.is('#'+parentfolderid)) {
            
            var hasul = parentfolder.find('ul');
            if (!hasul.is('ul')) {
              parentfolder.append('<ul id="follow"></ul>');
            }
            var folderView = new com.apress.view.FolderView({ model: folder });
            parentfolder.find('ul').append(folderView.render().el);

            for(i=0; i<this.untopfolders.length; i++){
              if(this.untopfolders[i] == folder){
                  this.untopfolders.splice(i, 1);
              }
            }
          }
        }
      }, this);
    } while (this.untopfolders.length > 0);
    return this;
  }
});

