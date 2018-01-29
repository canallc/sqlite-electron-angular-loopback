var gulp = require('gulp');
var hbsmaster = require('gulp-handlebars-master');
var rename = require('gulp-rename');

gulp.task('generateStaticPages', function() {
  var templateData = {
    "index" : {
      "title" : "Home",
      "nav_index" : "active"
    },
    "contributors" : {
      "title" : "Contributors",
      "nav_contributors" : "active"
    }
  };

  gulp.src(['./pages/*.hbs', '!./pages/master.hbs'])
  .pipe( hbsmaster('./pages/master.hbs', templateData, {}))
  .pipe( rename( function(path) {
    path.extname = '.html';
  }))
  .pipe(gulp.dest('./'));
});
