(function() {
  var CompositeDisposable, ZentabsController, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  ZentabsController = require('./zentabs-controller');

  module.exports = {
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var zentabController;
          zentabController = new ZentabsController(pane);
          if (_this.zentabsControllers == null) {
            _this.zentabsControllers = [];
          }
          _this.zentabsControllers.push(zentabController);
          _this.subscriptions.add(pane.onDidDestroy(function() {
            return _.remove(_this.zentabsControllers, zentabController);
          }));
          return zentabController;
        };
      })(this)));
    },
    deactivate: function() {
      var i, len, ref, ref1, results, zentabController;
      this.subscriptions.dispose();
      ref1 = (ref = this.zentabsControllers) != null ? ref : [];
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        zentabController = ref1[i];
        results.push(zentabController.remove() && zentabController.destroy());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy9yb24vLmF0b20vcGFja2FnZXMvemVudGFicy9saWIvemVudGFicy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixpQkFBQSxHQUFvQixPQUFBLENBQVEsc0JBQVI7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtBQUM3QyxjQUFBO1VBQUEsZ0JBQUEsR0FBbUIsSUFBSSxpQkFBSixDQUFzQixJQUF0Qjs7WUFDbkIsS0FBQyxDQUFBLHFCQUFzQjs7VUFDdkIsS0FBQyxDQUFBLGtCQUFrQixDQUFDLElBQXBCLENBQXlCLGdCQUF6QjtVQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsWUFBTCxDQUFrQixTQUFBO21CQUNuQyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSxrQkFBVixFQUE4QixnQkFBOUI7VUFEbUMsQ0FBbEIsQ0FBbkI7aUJBRUE7UUFONkM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQW5CO0lBRlEsQ0FBVjtJQVVBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0FBQ0E7QUFBQTtXQUFBLHNDQUFBOztxQkFBQSxnQkFBZ0IsQ0FBQyxNQUFqQixDQUFBLENBQUEsSUFBNkIsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTtBQUE3Qjs7SUFGVSxDQVZaOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5aZW50YWJzQ29udHJvbGxlciA9IHJlcXVpcmUgJy4vemVudGFicy1jb250cm9sbGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVBhbmVzIChwYW5lKSA9PlxuICAgICAgemVudGFiQ29udHJvbGxlciA9IG5ldyBaZW50YWJzQ29udHJvbGxlcihwYW5lKVxuICAgICAgQHplbnRhYnNDb250cm9sbGVycyA/PSBbXVxuICAgICAgQHplbnRhYnNDb250cm9sbGVycy5wdXNoKHplbnRhYkNvbnRyb2xsZXIpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgcGFuZS5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgXy5yZW1vdmUoQHplbnRhYnNDb250cm9sbGVycywgemVudGFiQ29udHJvbGxlcilcbiAgICAgIHplbnRhYkNvbnRyb2xsZXJcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHplbnRhYkNvbnRyb2xsZXIucmVtb3ZlKCkgJiYgemVudGFiQ29udHJvbGxlci5kZXN0cm95KCkgZm9yIHplbnRhYkNvbnRyb2xsZXIgaW4gQHplbnRhYnNDb250cm9sbGVycyA/IFtdXG4iXX0=
