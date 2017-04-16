// ==UserScript==
// @name        Unclutter VB5
// @namespace   RattleSN4K3/EpicGames
// @description Cleans up forum, mainly by removing additional space and merging elements
// @include     *//www.epicgames.com/unrealtournament/forums
// @include     *//www.epicgames.com/unrealtournament/forums/*
// @require     https://code.jquery.com/jquery-1.11.0.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.2/moment.min.js
// @version     0
// @grant       none
// ==/UserScript==

var IsProcessed = false;
mainProc();
momentProc();

function mainProc()
{  
  if (typeof jQuery == 'undefined') {
    console.log("no jquery. wait for it...");
    return;    
  }
    
  // mutex
  if (IsProcessed) return;
  IsProcessed = true;
  
  console.log("HideHeader VB5 loaded...");
  
  var topbar = $('#channel-tabbar');
  if (topbar == undefined || topbar == null) {
    console.log("No top bar");
    return;
  }

  var subbar = $('#channel-subtabbar');
  if (subbar == undefined || subbar == null) {
    console.log("No sub bar");
    return; 
  }
  
  var mainbar = $('#main-navbar');
  console.log(topbar);
  console.log(subbar);
  console.log(mainbar);

  
  // Move main-bar search into channel bar
  $('#header > .toolbar > ul > li.search-container').css('margin', '0px');
  $('#header > .toolbar > ul').detach().appendTo(topbar);
  

  $('ul.secondary-nav', mainbar).addClass('channel-subtabbar-list');
  $('ul.secondary-nav', mainbar).addClass('js-channel-subtabbar-list');
  $('ul.secondary-nav', mainbar).detach().appendTo(subbar);

  
  // add profile link
  $('.notifications-container').before('<li class="welcomelink">Welcome, <a href="'+window.profileUrl+'">'+window.userName+'</a></li>');

  // add profile options
  $('.notifications-container').after('<li class="logoutlink"><a href="'+window.logoutUrl+'" onclick="return log_out(\'Are you sure you want to log out?\')">Log Out</a></li>');
  $('.notifications-container').after('<li><a href="'+window.settingUrl+'">Settings</a></li>');
  //$('#notifications').before('<li><a href="'+window.PROFILEURL+'">My Profile</a></li>');

  // add register/login for guests
  if (window.pageData == undefined || window.pageData.userid == undefined || window.pageData.userid == '0') {
    var nouserlist = $('<ul></ul>')
    .addClass('nouser')
    .addClass('h-right')
    .addClass('channel-subtabbar-list')
    .addClass('js-channel-subtabbar-list');

    if (window.signInLinks != undefined && window.signInLinks.length > 0) {
      var registerurl = window.signInLinks[0].href;
      nouserlist.append('<li><a href="'+registerurl+'" rel="nofollow" class="notreg">Register</a></li>')
      nouserlist.append('<li>or</li>')
    }
    nouserlist.append('<li><a href="'+window.loginUrl+'" rel="nofollow" class="notreg">Sign in</a></li>')
    nouserlist.appendTo(subbar);
  }
  
  
  // sub-forum list into main forum entry
  $('.subforum-list').each(function(index_sub, subforum){
    var mainforum = $(subforum).prev('tr');
    /*
    var subdiv = $('<div />');
    $('.subforum-item', subforum).each(function(index_itm, subitm){
      //subli.append(subitm.unwrap());
      //subitm.unwrap();
      subdiv.append(subitm);
    });
    $(subforum).remove();    
    subdiv.css('margin-top', '15px');
    $('.forum-info', mainforum).append(subdiv);
    
    */
    
    // Somehow good
    //$('.forum-info', mainforum).append($('tr td div', subforum));
    //$(subforum).remove();
    
    var subformul = $('<ul style="margin-top: 10px;" />')
    $('tr td div', subforum).each(function(index_itm, subitm){
      $(subitm).css('width', '-moz-fit-content');
      subformul.append($('<li style="display: inline; float: left; margin-left: 10px;" />').append(subitm));
    });
    $('.forum-info', mainforum).append(subformul);
    $(subforum).remove();
    

    //$('.forum-info', mainforum).append($('td', subforum));

    //$(subforum).prev('tr').remove();
    //$(subforum).remove();
    //var libutton = $('<li></li>').append($(this));
    //$('ul', topicbar).first().append(libutton);
  });
  
  
  // 
  $('li.b-post').each(function(index_post, post) {
    var postlinks = $('.post-links', post);
    var postli = $('<li class="h-margin-top-m" />');
        //$('ul.h-left', post)
    //postlinks.detach().appendTo($('<li class="h-margin-top-m" />').append($('ul.h-left', post))) ;
    postlinks.detach().appendTo(postli);
    $('ul.h-left', post).append(postli);
    
    //postlinks.detach().appendTo(.remove();
  });
  
  
  var threadbar = $('#thread-view-tab .conversation-toolbar');
  if (threadbar != null && threadbar.length) {
    console.log("change thread bar");
    
    // check or create toolset
    var toolset = null;
    var toolsetcheck = $('ul.toolset-left', threadbar);
    if (toolsetcheck.length) {
      console.log("add to left toolset");
      toolset = toolsetcheck.first();
    } else if ($('ul.toolset-right', threadbar).length) {
      console.log("dup right toolset");
      var toolsetleft = $('ul.toolset-right', threadbar).clone().empty();
      toolsetleft.removeClass('toolset-right');
      toolsetleft.addClass('toolset-left');
      toolsetleft.appendTo(threadbar);
      toolset = toolsetleft;
    } else {
      console.log("what to do with toolset");
    }
      
    if (toolset != null) {
    
      // move subscribe button in thread toolset section
      $('.conversation-controls button').each(function(){
        var libutton = $('<li></li>').append($(this));
        toolset.append(libutton);
      });


      // add thread into thread bar
      var threadli = $('<li></li>')
      //threadli.addClass('ui-widget-header');
      var threaddiv = GetTitleDiv();// $('div.module-title').last();
      threaddiv.removeClass('module-title');
      var threada = $('<a href="'+GetThreadURL()+'"/>');
      threada.css('color', 'inherit');
      threada[0].style.setProperty('background-color', 'inherit', 'important');
      $('h1', threaddiv).wrapInner(threada);
      threadli.append(threaddiv);
      
      toolset.append(threadli);
      /*var threadli = $('<li></li>')
      var threadtitle = $('.module-title h1.main-title').last().text();
      //var threadlink = $('<a />')
      //threadlink.text(threadtitle);
      //threadlink.attr('href', GetThreadURL());
      //threadlink.addClass('linkcontainer');
      var threadlink = $('<a href="'+GetThreadURL()+'"/>');
      threadlink.text(threadtitle);
      threadlink.css('color', 'inherit');
      threadlink.css('background-color', 'inherit !important');
      $('.module-title h1.main-title').last().wrapInner(threadlink);
      
      threadli.append(threadlink);
      toolset.append(threadli);
      $('.module-title h1.main-title').last().remove();
      */

      // add 'goto to top/bottom'
      /*$('.toolset-right', threadbar)
      //.prepend('<li class="goto-bottom-container"><a href="' + location.href + '#post" class="button secondary goto-bottom-button"><label>Bottom</label><span class="vb-icon-wrapper"><span class="vb-icon vb-icon-triangle-down-wide"></span></span></a></li>')
      .prepend('<li><div><a href="' + location.href + '#topic-module-top" class="button secondary goto-top-button">Top<span class="vb-icon-wrapper"><span class="vb-icon vb-icon-triangle-up-wide"></span></a></div></li>')
      .prepend('<li class="goto-top-container"><a href="' + location.href + '#topic-module-top" class="button secondary goto-top-button"><label>Top</label><span class="vb-icon-wrapper"><span class="vb-icon vb-icon-triangle-up-wide"></span></span></a></li>')
      ;*/
    }
  }
  
  var topicbar = $('#topic-tab .conversation-toolbar');
  if (topicbar != null && topicbar.length) {
    console.log("change topic bar");
    
    // move subscribe button in topic toolset section
    $('.channel-controls button').each(function(){
      var libutton = $('<li></li>').append($(this));
      $('ul', topicbar).first().append(libutton);
    });
    
    // move rss icon into breadcrumbs
    var rssa = $('div.module-title a');
    var bread = $('#breadcrumbs');
    //$('<li class="vb-icon separator"></li>').appendTo(bread);
    //$('<li class="crumb ellipsis"></li>').append(bread);
    $('<li class="separator" />').appendTo(bread);
    rssa.appendTo(bread);

    
    // move title into topic bar
    var topiccontrols = $('ul', topicbar).first();
    if (topiccontrols.length) {
      var titleli = $('<li></li>')
      //titleli.addClass('ui-widget-header');
      var titlediv = $('div.module-title').last();
      titlediv.removeClass('module-title');
      var titlea = $('<a href="'+GetTopicURL()+'"/>');
      titlea.css('color', 'inherit');
      titlea[0].style.setProperty('background-color', 'inherit', 'important');
      $('h1', titlediv).wrapInner(titlea);
      titleli.append(titlediv);

      topiccontrols.append(titleli);
    } else {
      // remove remaining title
      $('div.module-title').last().remove();
    }
  }
  
  // move page title into breadcrumbs if not in thread/topic view
  var pagetitle = GetTitleDiv();
  if (pagetitle != null && pagetitle.length) {
    pagetitle = pagetitle.first();
    
    var bread = $('#breadcrumbs');
    if (!bread.is(':empty')) {
      $('<li class="vb-icon separator"></li>').appendTo(bread);
      $('<li class="crumb ellipsis"></li>').append($('h1', pagetitle).html()).appendTo(bread);
    
      pagetitle.remove();
    } else {
      $('.widget-content .b-button.b-button--secondary').after($('h1', pagetitle));
      pagetitle.remove();
    }
  }
  
  // increase editor height
  $('.cke_inner .cke_contents').each(function(index, editor) {
    console.log("editor too small");
    $(editor).css('height', '150px');
    /*if ($(editor).height() < 100) {
      
      $(editor).css('height', $(editor).height() + 'px');
    }*/
  });
  
  
  
  // thread likes
  $('.votes-count').remove();    
  
  // remove margin from thread bar
  $('.widget-content').css('margin-top', '0px');

  // remove header
  $('#header').remove();
  
  // fixing line wrapping of links in sub-bar 
  $('li > a', subbar).css('display', 'inline');
  
  // fixing widget offset
  $('.b-module.canvas-widget').css('min-height', '0px');
  //$('.b-module.canvas-widget').css('margin-bottom', '0px');
  $('.b-module.canvas-widget').each(function(index, widget){
    if (!$(widget).is(':visible') || $(widget).is(':hidden')) {
      $(widget).css('margin-bottom', '0px');
    } else {
      $(widget).css('margin-bottom', 'auto');
    }
  });
}

function momentProc() {
  
  $('time').each(function(i, elem) {
    //console.log($(elem).html());
    var d = moment($(elem).html(), 'MM/DD/YYYY, hh:mm a');
    //console.log(d);
//    d.locale('fr');
    //console.log(d.local().format("YYYY-MM-DD HH:mm:ss"));
    //console.log(moment('dddd').format());
    //console.log(moment("Sunday, February 28, 2010").format('MM/DD/YYYY'));
    if (d.isValid) {
      $(elem).html(d.format("YYYY-MM-DD HH:mm"));
    }
  });
  
  $('div.post-date:not(:has("*")), span.post-date:not(:has("*")), span.date:not(:has("*"))').each(function(i, elem) {
    //console.log($(elem).html());
    var d = moment($(elem).html(), 'MM/DD/YYYY, hh:mm a');
    //console.log(d);
//    d.locale('fr');
    //console.log(d.local().format("YYYY-MM-DD HH:mm:ss"));
    //console.log(moment('dddd').format());
    //console.log(moment("Sunday, February 28, 2010").format('MM/DD/YYYY'));
    if (d.isValid) {
      $(elem).html(d.format("YYYY-MM-DD HH:mm"));
    }
  });
  
  
  $('.profile-info-item:contains("Last Activity")').each(function(i, elem) {
    var d = moment($(elem).html(), '[Last Activity:] MM/DD/YYYY, hh:mm a');
    $(elem).html(d.local().format("[Last Activity:] YYYY-MM-DD HH:mm"));
  });

  $('.profile-info-item:contains("Joined")').each(function(i, elem) {
    var d = moment($(elem).html(), '[Joined:] MM/DD/YYYY');
    $(elem).html(d.local().format("[Joined:] YYYY-MM-DD"));
  });
}

function GetTitleDiv() {
  var returndiv = null;
  $('.b-module.page-title-widget').each(function(index, div) {
    if (!$(div).hasClass('announcement-widget')) {
      if (returndiv == null) returndiv = $('.module-title', $(div));
    }
  });
  
  return returndiv;
}

function GetTopicURL() {
  var formref = $('.pagenav-controls > form');
  return formref && formref.first().attr('action');
}

function GetThreadURL() {
  var formref = $('.pagenav-controls > form');
  return formref && formref.first().attr('action');
}