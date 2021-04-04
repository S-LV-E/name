(function() {
  var $, CompositeDisposable, View, ZentabsController, _, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  _ = require('underscore-plus');

  module.exports = ZentabsController = (function(superClass) {
    extend(ZentabsController, superClass);

    function ZentabsController() {
      this.toggleTab = bind(this.toggleTab, this);
      this.unpinTab = bind(this.unpinTab, this);
      this.pinTab = bind(this.pinTab, this);
      this.destroy = bind(this.destroy, this);
      return ZentabsController.__super__.constructor.apply(this, arguments);
    }

    ZentabsController.content = function() {
      return this.span('');
    };

    ZentabsController.prototype.initialize = function(pane1) {
      var i, item, len, ref1;
      this.pane = pane1;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'zentabs:cleanup', (function(_this) {
        return function() {
          return _this.closeOverflowingTabs();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'zentabs:pintab', this.pinTab));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'zentabs:unpintab', this.unpinTab));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'zentabs:toggletab', this.toggleTab));
      this.items = [];
      this.pinnedItems = [];
      ref1 = this.pane.getItems();
      for (i = 0, len = ref1.length; i < len; i++) {
        item = ref1[i];
        this.pushItem(item);
      }
      this.subscriptions.add(this.pane.onDidDestroy((function(_this) {
        return function(pane) {
          if (pane === _this.pane) {
            return _this.unsubscribe();
          }
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidAddItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          _this.pushItem(item);
          if (!atom.config.get('zentabs.manualMode')) {
            setTimeout((function() {
              return _this.closeOverflowingTabs(item);
            }), 0);
          }
          return true;
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidRemoveItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          _.remove(_this.pinnedItems, item);
          _.remove(_this.items, item);
          return true;
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidChangeActiveItem((function(_this) {
        return function() {
          _this.updateActiveTab();
          return true;
        };
      })(this)));
      this.updateActiveTab();
      if (!atom.config.get('zentabs.manualMode')) {
        return this.closeOverflowingTabs();
      }
    };

    ZentabsController.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    ZentabsController.prototype.pushItem = function(item) {
      if (!(this.pinnedItems.indexOf(item) > -1)) {
        return this.items.push(item);
      }
    };

    ZentabsController.prototype.updateActiveTab = function() {
      var item;
      item = this.pane.getActiveItem();
      if (!item) {
        return;
      }
      if (this.pinnedItems.indexOf(item) > -1) {
        return;
      }
      _.remove(this.items, item);
      return this.items.push(item);
    };

    ZentabsController.prototype.getRepositories = function() {
      return atom.project.getRepositories();
    };

    ZentabsController.prototype.closeOverflowingTabs = function(newItem) {
      var itemAmount, maxTabs, neverCloseDirty, neverCloseNew, neverCloseUnsaved, tmpItems;
      maxTabs = atom.config.get('zentabs.maximumOpenedTabs');
      neverCloseUnsaved = atom.config.get('zentabs.neverCloseUnsaved');
      neverCloseDirty = atom.config.get('zentabs.neverCloseDirty');
      neverCloseNew = atom.config.get('zentabs.neverCloseNew');
      tmpItems = this.items.slice(0);
      itemAmount = this.items.length;
      return tmpItems.forEach((function(_this) {
        return function(olderItem) {
          var itemPath, preventBecauseDirty, preventBecauseNew, preventBecauseUnsaved, ref1, ref2, ref3;
          if (itemAmount > maxTabs) {
            preventBecauseUnsaved = ((ref1 = olderItem.buffer) != null ? ref1.isModified() : void 0) && neverCloseUnsaved;
            preventBecauseDirty = false;
            preventBecauseNew = false;
            if (itemPath = (ref2 = olderItem.buffer) != null ? (ref3 = ref2.file) != null ? ref3.path : void 0 : void 0) {
              _this.getRepositories().forEach(function(repo) {
                if (!repo) {
                  return;
                }
                preventBecauseDirty = preventBecauseDirty || repo.isPathModified(itemPath) && neverCloseDirty;
                return preventBecauseNew = preventBecauseNew || repo.isPathNew(itemPath) && neverCloseNew;
              });
            }
            if (!(preventBecauseUnsaved || preventBecauseDirty || preventBecauseNew || newItem === olderItem)) {
              _this.pane.destroyItem(olderItem);
              return itemAmount -= 1;
            }
          }
        };
      })(this));
    };

    ZentabsController.prototype.pinTab = function() {
      var item, tab, view;
      tab = $('.tab.right-clicked').first();
      if (tab.size() === 0) {
        return;
      }
      view = atom.views.getView(tab);
      item = view.item;
      _.remove(this.items, item);
      if (!(this.pinnedItems.indexOf(item) > -1)) {
        this.pinnedItems.push(item);
      }
      return tab.addClass('pinned');
    };

    ZentabsController.prototype.unpinTab = function(event) {
      var item, tab, view;
      tab = $('.tab.right-clicked').first();
      if (tab.size() === 0) {
        return;
      }
      view = atom.views.getView(tab);
      item = view.item;
      _.remove(this.pinnedItems, item);
      this.pushItem(item);
      tab.removeClass('pinned');
      return this.closeOverflowingTabs();
    };

    ZentabsController.prototype.toggleTab = function() {
      var item, tab, view;
      tab = $('.tab.active');
      if (!tab) {
        return;
      }
      view = atom.views.getView(tab);
      item = view.item;
      if (tab.hasClass('pinned')) {
        this.pushItem(item);
        tab.removeClass('pinned');
        return this.closeOverflowingTabs();
      } else {
        _.remove(this.items, item);
        if (!(this.pinnedItems.indexOf(item) > -1)) {
          this.pinnedItems.push(item);
        }
        return tab.addClass('pinned');
      }
    };

    return ZentabsController;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy9yb24vLmF0b20vcGFja2FnZXMvemVudGFicy9saWIvemVudGFicy1jb250cm9sbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdURBQUE7SUFBQTs7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFDSixDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7O0lBRUosaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU0sRUFBTjtJQURROztnQ0FHVixVQUFBLEdBQVksU0FBQyxLQUFEO0FBQ1YsVUFBQTtNQURXLElBQUMsQ0FBQSxPQUFEO01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxpQkFBcEMsRUFBdUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxvQkFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZ0JBQXBDLEVBQXNELElBQUMsQ0FBQSxNQUF2RCxDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGtCQUFwQyxFQUF3RCxJQUFDLENBQUEsUUFBekQsQ0FBbkI7TUFDQSxJ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Q0FBQSxXQUFWLEVBQXVCLElBQXZCO01BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO01BRUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsUUFBaEI7YUFHQSxJQUFDLENBQUEsb0JBQUQsQ0FBQTtJQWRROztnQ0FnQlYsU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsR0FBQSxHQUFNLENBQUEsQ0FBRSxhQUFGO01BQ04sSUFBQSxDQUFjLEdBQWQ7QUFBQSxlQUFBOztNQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsR0FBbkI7TUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDO01BQ1osSUFBRyxHQUFHLENBQUMsUUFBSixDQUFhLFFBQWIsQ0FBSDtRQUNFLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtRQUNBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLFFBQWhCO2VBQ0EsSUFBQyxDQUFBLG9CQUFELENBQUEsRUFIRjtPQUFBLE1BQUE7UUFLRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxLQUFWLEVBQWlCLElBQWpCO1FBQ0EsSUFBQSxDQUFBLENBQThCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixJQUFyQixDQUFBLEdBQTZCLENBQUMsQ0FBNUQsQ0FBQTtVQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixFQUFBOztlQUNBLEdBQUcsQ0FBQyxRQUFKLENBQWEsUUFBYixFQVBGOztJQU5TOzs7O0tBNUdtQjtBQUxoQyIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFplbnRhYnNDb250cm9sbGVyIGV4dGVuZHMgVmlld1xuXG4gIEBjb250ZW50OiAoKS0+XG4gICAgQHNwYW4gJydcblxuICBpbml0aWFsaXplOiAoQHBhbmUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICd6ZW50YWJzOmNsZWFudXAnLCA9PiBAY2xvc2VPdmVyZmxvd2luZ1RhYnMoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnemVudGFiczpwaW50YWInLCBAcGluVGFiXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICd6ZW50YWJzOnVucGludGFiJywgQHVucGluVGFiXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICd6ZW50YWJzOnRvZ2dsZXRhYicsIEB0b2dnbGVUYWJcblxuICAgIEBpdGVtcyA9IFtdXG4gICAgQHBpbm5lZEl0ZW1zID0gW11cbiAgICBAcHVzaEl0ZW0oaXRlbSkgZm9yIGl0ZW0gaW4gQHBhbmUuZ2V0SXRlbXMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkRGVzdHJveSAocGFuZSkgPT5cbiAgICAgIEB1bnN1YnNjcmliZSgpIGlmIHBhbmUgaXMgQHBhbmVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZEFkZEl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEBwdXNoSXRlbSBpdGVtXG4gICAgICB1bmxlc3MgYXRvbS5jb25maWcuZ2V0ICd6ZW50YWJzLm1hbnVhbE1vZGUnXG4gICAgICAgIHNldFRpbWVvdXQgKD0+IEBjbG9zZU92ZXJmbG93aW5nVGFicyhpdGVtKSksIDBcbiAgICAgIHRydWVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZFJlbW92ZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIF8ucmVtb3ZlIEBwaW5uZWRJdGVtcywgaXRlbVxuICAgICAgXy5yZW1vdmUgQGl0ZW1zLCBpdGVtXG4gICAgICB0cnVlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRDaGFuZ2VBY3RpdmVJdGVtID0+XG4gICAgICBAdXBkYXRlQWN0aXZlVGFiKClcbiAgICAgIHRydWVcblxuICAgIEB1cGRhdGVBY3RpdmVUYWIoKVxuICAgIEBjbG9zZU92ZXJmbG93aW5nVGFicygpIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgJ3plbnRhYnMubWFudWFsTW9kZSdcblxuICBkZXN0cm95OiA9PlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHB1c2hJdGVtOiAoaXRlbSktPlxuICAgIEBpdGVtcy5wdXNoIGl0ZW0gdW5sZXNzIEBwaW5uZWRJdGVtcy5pbmRleE9mKGl0ZW0pID4gLTFcblxuICB1cGRhdGVBY3RpdmVUYWI6IC0+XG4gICAgaXRlbSA9IEBwYW5lLmdldEFjdGl2ZUl0ZW0oKVxuICAgIHJldHVybiB1bmxlc3MgaXRlbVxuICAgIHJldHVybiBpZiBAcGlubmVkSXRlbXMuaW5kZXhPZihpdGVtKSA+IC0xICMgZG8gbm90aGluZyBpZiBpdGVtIGlzIHBpbm5lZFxuICAgIF8ucmVtb3ZlIEBpdGVtcywgaXRlbVxuICAgIEBpdGVtcy5wdXNoIGl0ZW1cblxuICBnZXRSZXBvc2l0b3JpZXM6IC0+IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVxuXG4gIGNsb3NlT3ZlcmZsb3dpbmdUYWJzOiAobmV3SXRlbSktPlxuICAgIG1heFRhYnMgPSBhdG9tLmNvbmZpZy5nZXQgJ3plbnRhYnMubWF4aW11bU9wZW5lZFRhYnMnXG4gICAgbmV2ZXJDbG9zZVVuc2F2ZWQgPSBhdG9tLmNvbmZpZy5nZXQgJ3plbnRhYnMubmV2ZXJDbG9zZVVuc2F2ZWQnXG4gICAgbmV2ZXJDbG9zZURpcnR5ID0gYXRvbS5jb25maWcuZ2V0ICd6ZW50YWJzLm5ldmVyQ2xvc2VEaXJ0eSdcbiAgICBuZXZlckNsb3NlTmV3ID0gYXRvbS5jb25maWcuZ2V0ICd6ZW50YWJzLm5ldmVyQ2xvc2VOZXcnXG5cbiAgICB0bXBJdGVtcyA9IEBpdGVtcy5zbGljZSAwXG4gICAgaXRlbUFtb3VudCA9IEBpdGVtcy5sZW5ndGhcbiAgICB0bXBJdGVtcy5mb3JFYWNoIChvbGRlckl0ZW0pID0+XG4gICAgICBpZiBpdGVtQW1vdW50ID4gbWF4VGFic1xuICAgICAgICAjIENoZWNrIHRhYiBzYXZlZCBzdGF0dXNcbiAgICAgICAgcHJldmVudEJlY2F1c2VVbnNhdmVkID0gb2xkZXJJdGVtLmJ1ZmZlcj8uaXNNb2RpZmllZCgpICYmIG5ldmVyQ2xvc2VVbnNhdmVkXG4gICAgICAgIHByZXZlbnRCZWNhdXNlRGlydHkgPSBmYWxzZVxuICAgICAgICBwcmV2ZW50QmVjYXVzZU5ldyA9IGZhbHNlXG5cbiAgICAgICAgaWYgaXRlbVBhdGggPSBvbGRlckl0ZW0uYnVmZmVyPy5maWxlPy5wYXRoXG4gICAgICAgICAgQGdldFJlcG9zaXRvcmllcygpLmZvckVhY2ggKHJlcG8pIC0+XG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIHJlcG9cbiAgICAgICAgICAgIHByZXZlbnRCZWNhdXNlRGlydHkgPSBwcmV2ZW50QmVjYXVzZURpcnR5IHx8IHJlcG8uaXNQYXRoTW9kaWZpZWQoaXRlbVBhdGgpICYmIG5ldmVyQ2xvc2VEaXJ0eVxuICAgICAgICAgICAgcHJldmVudEJlY2F1c2VOZXcgPSBwcmV2ZW50QmVjYXVzZU5ldyB8fCByZXBvLmlzUGF0aE5ldyhpdGVtUGF0aCkgJiYgbmV2ZXJDbG9zZU5ld1xuXG4gICAgICAgIHVubGVzcyBwcmV2ZW50QmVjYXVzZVVuc2F2ZWQgfHwgcHJldmVudEJlY2F1c2VEaXJ0eSB8fCBwcmV2ZW50QmVjYXVzZU5ldyB8fCBuZXdJdGVtID09IG9sZGVySXRlbVxuICAgICAgICAgIEBwYW5lLmRlc3Ryb3lJdGVtIG9sZGVySXRlbVxuICAgICAgICAgIGl0ZW1BbW91bnQgLT0gMVxuXG4gIHBpblRhYjogKCkgPT5cbiAgICB0YWIgPSAkKCcudGFiLnJpZ2h0LWNsaWNrZWQnKS5maXJzdCgpXG4gICAgcmV0dXJuIGlmIHRhYi5zaXplKCkgaXMgMFxuXG4gICAgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyB0YWJcbiAgICBpdGVtID0gdmlldy5pdGVtXG5cbiAgICBfLnJlbW92ZSBAaXRlbXMsIGl0ZW1cblxuICAgIEBwaW5uZWRJdGVtcy5wdXNoIGl0ZW0gdW5sZXNzIEBwaW5uZWRJdGVtcy5pbmRleE9mKGl0ZW0pID4gLTFcblxuICAgIHRhYi5hZGRDbGFzcyAncGlubmVkJ1xuICAgICMgdGFiLmZpbmQoJy50aXRsZScpLmFkZENsYXNzICdpY29uIGljb24tbG9jaycgaWYgYXRvbS5jb25maWcuZ2V0ICd6ZW50YWJzLnNob3dQaW5uZWRJY29uJ1xuXG4gIHVucGluVGFiOiAoZXZlbnQpID0+XG4gICAgdGFiID0gJCgnLnRhYi5yaWdodC1jbGlja2VkJykuZmlyc3QoKVxuICAgIHJldHVybiBpZiB0YWIuc2l6ZSgpIGlzIDBcblxuICAgIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgdGFiXG4gICAgaXRlbSA9IHZpZXcuaXRlbVxuXG4gICAgXy5yZW1vdmUgQHBpbm5lZEl0ZW1zLCBpdGVtXG5cbiAgICBAcHVzaEl0ZW0gaXRlbVxuXG4gICAgdGFiLnJlbW92ZUNsYXNzICdwaW5uZWQnXG4gICAgIyB0YWIuZmluZCgnLnRpdGxlJykucmVtb3ZlQ2xhc3MgJ2ljb24gaWNvbi1sb2NrJ1xuXG4gICAgQGNsb3NlT3ZlcmZsb3dpbmdUYWJzKClcblxuICB0b2dnbGVUYWI6ID0+XG4gICAgdGFiID0gJCgnLnRhYi5hY3RpdmUnKVxuICAgIHJldHVybiB1bmxlc3MgdGFiXG5cbiAgICB2aWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3IHRhYlxuICAgIGl0ZW0gPSB2aWV3Lml0ZW1cbiAgICBpZiB0YWIuaGFzQ2xhc3MoJ3Bpbm5lZCcpXG4gICAgICBAcHVzaEl0ZW0gaXRlbVxuICAgICAgdGFiLnJlbW92ZUNsYXNzICdwaW5uZWQnXG4gICAgICBAY2xvc2VPdmVyZmxvd2luZ1RhYnMoKVxuICAgIGVsc2VcbiAgICAgIF8ucmVtb3ZlIEBpdGVtcywgaXRlbVxuICAgICAgQHBpbm5lZEl0ZW1zLnB1c2ggaXRlbSB1bmxlc3MgQHBpbm5lZEl0ZW1zLmluZGV4T2YoaXRlbSkgPiAtMVxuICAgICAgdGFiLmFkZENsYXNzICdwaW5uZWQnXG4iXX0=
