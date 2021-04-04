(function() {
  var initCount, themeConfig;

  initCount = 0;

  themeConfig = null;

  module.exports = {
    config: {
      fontFamily: {
        title: 'Font Family',
        description: 'Experimental: set to gtk-3 to load the font settings from ~/.config/gtk-3.0/settings.ini',
        type: 'string',
        "default": 'Ubuntu',
        "enum": ['Ubuntu', 'Cantarell', 'Sans Serif', 'DejaVu Sans', 'Oxygen-Sans', 'Droid Sans', 'gtk-3']
      },
      fontSize: {
        title: 'Font Size',
        description: 'Set to -1 for auto',
        type: 'number',
        "default": '-1'
      },
      iconTheme: {
        title: 'Icon Theme',
        type: 'string',
        "default": 'No Icons',
        "enum": ['No Icons', 'Octicons']
      }
    },
    activate: function(state) {
      var _initCount;
      initCount++;
      _initCount = initCount;
      return setTimeout(function() {
        var ThemeConfig;
        if (_initCount !== initCount) {
          return;
        }
        ThemeConfig = require('./config');
        console.log("Loading ambiance-pro-ui...");
        themeConfig = new ThemeConfig();
        return themeConfig.init();
      }, 10);
    },
    deactivate: function(state) {
      if (themeConfig != null) {
        themeConfig.destroy();
      }
      return themeConfig = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy9yb24vLmF0b20vcGFja2FnZXMvYW1iaWFuY2UtcHJvLXVpL2xpYi9hbWJpYW5jZS1wcm8tdWkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLEdBQVk7O0VBQ1osV0FBQSxHQUFjOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxNQUFBLEVBV0U7TUFBQSxVQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sYUFBUDtRQUNBLFdBQUEsRUFBYSwwRkFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxRQUhUO1FBSUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUNKLFFBREksRUFFSixXQUZJLEVBR0osWUFISSxFQUlKLGFBSkksRUFLSixhQUxJLEVBTUosWUFOSSxFQU9KLE9BUEksQ0FKTjtPQURGO01BY0EsUUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFdBQVA7UUFDQSxXQUFBLEVBQWEsb0JBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtPQWZGO01BbUJBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRlQ7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQ0osVUFESSxFQUVKLFVBRkksQ0FITjtPQXBCRjtLQVhGO0lBeUNBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFFUixVQUFBO01BQUEsU0FBQTtNQUNBLFVBQUEsR0FBYTthQUNiLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsWUFBQTtRQUFBLElBQUcsVUFBQSxLQUFnQixTQUFuQjtBQUFrQyxpQkFBbEM7O1FBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSO1FBQ2QsT0FBTyxDQUFDLEdBQVIsQ0FBWSw0QkFBWjtRQUNBLFdBQUEsR0FBYyxJQUFJLFdBQUosQ0FBQTtlQUNkLFdBQVcsQ0FBQyxJQUFaLENBQUE7TUFMUyxDQUFYLEVBTUUsRUFORjtJQUpRLENBekNWO0lBb0RBLFVBQUEsRUFBWSxTQUFDLEtBQUQ7O1FBQ1YsV0FBVyxDQUFFLE9BQWIsQ0FBQTs7YUFDQSxXQUFBLEdBQWM7SUFGSixDQXBEWjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbImluaXRDb3VudCA9IDBcbnRoZW1lQ29uZmlnID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgY29uZmlnOlxuICAgICMgdGhlbWU6XG4gICAgIyAgIHRpdGxlOiAnVGhlbWUnXG4gICAgIyAgIGRlc2NyaXB0aW9uOiAnVXNlIHRoZSBkYXJrIG9yIGxpZ2h0IGNvbG9yIHRoZW1lLiBBdXRvIHdpbGwgZ3Vlc3MgYmFzZWQgb24geW91ciBzeW50YXggdGhlbWUuJ1xuICAgICMgICB0eXBlOiAnc3RyaW5nJ1xuICAgICMgICBkZWZhdWx0OiAnYXV0bydcbiAgICAjICAgZW51bTogW1xuICAgICMgICAgICdhdXRvJyxcbiAgICAjICAgICAnbGlnaHQnLFxuICAgICMgICAgICdkYXJrJyxcbiAgICAjICAgXVxuICAgIGZvbnRGYW1pbHk6XG4gICAgICB0aXRsZTogJ0ZvbnQgRmFtaWx5J1xuICAgICAgZGVzY3JpcHRpb246ICdFeHBlcmltZW50YWw6IHNldCB0byBndGstMyB0byBsb2FkIHRoZSBmb250IHNldHRpbmdzIGZyb20gfi8uY29uZmlnL2d0ay0zLjAvc2V0dGluZ3MuaW5pJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdVYnVudHUnXG4gICAgICBlbnVtOiBbXG4gICAgICAgICdVYnVudHUnLFxuICAgICAgICAnQ2FudGFyZWxsJyxcbiAgICAgICAgJ1NhbnMgU2VyaWYnLFxuICAgICAgICAnRGVqYVZ1IFNhbnMnLFxuICAgICAgICAnT3h5Z2VuLVNhbnMnLFxuICAgICAgICAnRHJvaWQgU2FucycsXG4gICAgICAgICdndGstMydcbiAgICAgIF1cbiAgICBmb250U2l6ZTpcbiAgICAgIHRpdGxlOiAnRm9udCBTaXplJ1xuICAgICAgZGVzY3JpcHRpb246ICdTZXQgdG8gLTEgZm9yIGF1dG8nXG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgZGVmYXVsdDogJy0xJ1xuICAgIGljb25UaGVtZTpcbiAgICAgIHRpdGxlOiAnSWNvbiBUaGVtZSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnTm8gSWNvbnMnXG4gICAgICBlbnVtOiBbXG4gICAgICAgICdObyBJY29ucycsXG4gICAgICAgICdPY3RpY29ucycsXG4gICAgICAgICMgJ0Fkd2FpdGEnLFxuICAgICAgICAjICdCcmVlemUnXG4gICAgICBdXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIGNvZGUgaW4gc2VwYXJhdGUgZmlsZSBzbyBkZWZlcnJhbCBrZWVwcyBhY3RpdmF0aW9uIHRpbWUgZG93blxuICAgIGluaXRDb3VudCsrXG4gICAgX2luaXRDb3VudCA9IGluaXRDb3VudFxuICAgIHNldFRpbWVvdXQgLT5cbiAgICAgIGlmIF9pbml0Q291bnQgaXNudCBpbml0Q291bnQgdGhlbiByZXR1cm5cbiAgICAgIFRoZW1lQ29uZmlnID0gcmVxdWlyZSAnLi9jb25maWcnXG4gICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgYW1iaWFuY2UtcHJvLXVpLi4uXCIpXG4gICAgICB0aGVtZUNvbmZpZyA9IG5ldyBUaGVtZUNvbmZpZygpXG4gICAgICB0aGVtZUNvbmZpZy5pbml0KClcbiAgICAsIDEwXG4gIGRlYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICB0aGVtZUNvbmZpZz8uZGVzdHJveSgpXG4gICAgdGhlbWVDb25maWcgPSBudWxsXG4iXX0=
