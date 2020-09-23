// Generic Variables
var body,
    clicked,
    invert,
    starting_x,
    starting_y,
    map_inner_wrapper,
    mini_map_location,
    scale_factor,
    prefix,
    scaled_difference_x,
    scaled_difference_y,
    zoom_level;

// Large Map Variables
var difference_x,
    difference_y,
    cached_difference_x,
    cached_difference_y,
    img_width_boundry,
    img_height_boundry;

// Mini Map Variables
var mini_map_difference_x,
    mini_map_difference_y,
    mini_map_cached_difference_x,
    mini_map_cached_difference_y,
    mini_map_scale_factor,
    mini_map_img_width_boundry,
    mini_map_img_height_boundry;

document.addEventListener("DOMContentLoaded", function(){
  imagesLoaded( document.body, function() {
    document.body.classList.add('loaded');
    if (document.body.classList.contains('map')){
      init();
    }
  });
});

function init(){
  // Init generic variables
  starting_x = 0;
  starting_y = 0;
  scaled_difference_x = 0;
  scaled_difference_y = 0;
  large_map = false;
  body = document.body;
  map_inner_wrapper = document.getElementById('map_inner_wrapper');
  mini_map_location = document.getElementById('mini_map_location');
  zoom_level = 2;

  // Init Large Map Variables
  difference_x = 0;
  difference_y = 0;
  cached_difference_x = 0;
  cached_difference_y = 0;


  // Init Large Map Variables
  mini_map_difference_x = 0;
  mini_map_difference_y = 0;
  mini_map_cached_difference_x = 0;
  mini_map_cached_difference_y = 0;

  setImageBoundaries();

  // Add Event Listeners
  body.addEventListener('mousedown', startDrag);
  body.addEventListener('mousemove', dragging);
  body.addEventListener('mouseup', endDrag);

  window.addEventListener('resize', resizeHandler);

  document.getElementById('zoom_in').addEventListener('click', zoomIn);
  document.getElementById('zoom_out').addEventListener('click', zoomOut);
}

function resizeHandler(){
  setImageBoundaries();
}

function setImageBoundaries(){
  var map_image         = document.getElementById('map_image');
  var map_outer_wrapper = document.getElementById('map_outer_wrapper');
  var mini_map_image    = document.getElementById('mini_map_image');

  scale_factor = document.getElementById('mini_map_outer_wrapper').clientWidth / map_image.width;

  img_width_boundry = map_image.width/2 - map_outer_wrapper.clientWidth/2;
  img_height_boundry = map_image.height/2 - map_outer_wrapper.clientHeight/2;

  mini_map_img_width_boundry = mini_map_image.width/2 - mini_map_location.clientWidth/2;
  mini_map_img_height_boundry =  mini_map_image.height/2 - mini_map_location.clientHeight/2;
}

function startDrag(e){
  if (e.target.id == 'map_inner_wrapper' || e.target.id == 'mini_map_outer_wrapper'){
    if (e.target.id == 'mini_map_outer_wrapper'){
      prefix = 'mini_map_';
    } else{
      prefix = '';
    }
    clicked = true;
    starting_x = e.clientX;
    starting_y = e.clientY;
    e.preventDefault();
    e.stopPropagation();
  }
}

function dragging(e){
  if (clicked){
    window[(prefix + 'difference_x')] = window[(prefix + 'cached_difference_x')] + e.clientX - starting_x;
    window[(prefix + 'difference_y')] = window[(prefix + 'cached_difference_y')] + e.clientY - starting_y;

    checkExtremes();
  }
}

function checkExtremes(){
  if (window[(prefix + 'difference_x')] > window[(prefix + 'img_width_boundry')]){
    window[(prefix + 'difference_x')] = window[(prefix + 'img_width_boundry')];
  }

  if (window[(prefix + 'difference_x')] < -window[(prefix + 'img_width_boundry')]){
    window[(prefix + 'difference_x')] = -window[(prefix + 'img_width_boundry')];
  }

  if (window[(prefix + 'difference_y')] > window[(prefix + 'img_height_boundry')]){
    window[(prefix + 'difference_y')] = window[(prefix + 'img_height_boundry')];
  }

  if (window[(prefix + 'difference_y')] < -window[(prefix + 'img_height_boundry')]){
    window[(prefix + 'difference_y')] = -window[(prefix + 'img_height_boundry')];
  }
  positionMap();
}

function positionMap(){
  if (prefix == ''){
    scaled_difference_x = window[(prefix + 'difference_x')] * scale_factor;
    scaled_difference_y = window[(prefix + 'difference_y')] * scale_factor;
    map_inner_wrapper.style.top = 'calc(50% + ' + window[(prefix + 'difference_y')] + 'px)';
    map_inner_wrapper.style.left = 'calc(50% + ' + window[(prefix + 'difference_x')] + 'px)';
    mini_map_location.style.top = 'calc(50% - ' + scaled_difference_y + 'px)';
    mini_map_location.style.left = 'calc(50% - ' + scaled_difference_x + 'px)';
  } else{
    scaled_difference_x = window[(prefix + 'difference_x')] / scale_factor;
    scaled_difference_y = window[(prefix + 'difference_y')] / scale_factor;
    map_inner_wrapper.style.top = 'calc(50% - ' + scaled_difference_y + 'px)';
    map_inner_wrapper.style.left = 'calc(50% - ' + scaled_difference_x + 'px)';
    mini_map_location.style.top = 'calc(50% + ' + window[(prefix + 'difference_y')] + 'px)';
    mini_map_location.style.left = 'calc(50% + ' + window[(prefix + 'difference_x')] + 'px)';
  }
}

function endDrag(e){
  calcCachedValues();
  clicked = false;
}

function calcCachedValues(){
  if (prefix == ''){
    cached_difference_x = difference_x;
    cached_difference_y = difference_y;
    mini_map_cached_difference_x = -scaled_difference_x;
    mini_map_cached_difference_y = -scaled_difference_y;
  } else {
    cached_difference_x = -scaled_difference_x;
    cached_difference_y = -scaled_difference_y;
    mini_map_cached_difference_x = mini_map_difference_x;
    mini_map_cached_difference_y = mini_map_difference_y;
  }
}

function zoomIn(){
  if (document.body.classList.contains('zoom_out')){
    document.body.classList.remove('zoom_out');
  } else if (!document.body.classList.contains('zoom_in')){
    document.body.classList.add('zoom_in');
  }
  
  setImageBoundaries(); 
  checkExtremes();
}

function zoomOut(){
  if (document.body.classList.contains('zoom_in')){
    document.body.classList.remove('zoom_in');
  } else if (!document.body.classList.contains('zoom_out')){
    document.body.classList.add('zoom_out');
  }
  setImageBoundaries(); 
  checkExtremes(); 
}