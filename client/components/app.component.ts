import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <!-- Fixed navbar -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Demo</a>
        </div>
        <!--
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
          </ul>
        </div>--><!--/.nav-collapse -->
      </div>
    </nav>
    <div class="container theme-showcase" role="main">

      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <h1>Welcome!</h1>
        <p>
          This starter project demonstrates the integration of Sqlite, Electron, Angular, and Loopback.
          As a demo, we're using a basic <em>ToDo</em> list.
        </p>
        <p>
          To interface with the Loopback Rest API directly, start <a href="/explorer">exploring</a>.
        </p>
      </div>

      <todo></todo>

    </div>
  `,
})
export class AppComponent  {}
