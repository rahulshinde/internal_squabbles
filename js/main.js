var map_inner_wrapper,
    mini_map_location,
    body,
    clicked,
    starting_x,
    starting_y,
    difference_x,
    difference_y,
    cached_difference_x,
    cached_difference_y,
    img_width_boundry,
    img_height_boundry,
    scale_factor;

document.addEventListener("DOMContentLoaded", function(){
  init();
});

function init(){
  map_inner_wrapper = document.getElementById('map_inner_wrapper');
  mini_map_location = document.getElementById('mini_map_location');
  body = document.body;
  body.addEventListener('mousedown', startDrag);
  body.addEventListener('mousemove', dragging);
  body.addEventListener('mouseup', endDrag);
  difference_x = 0;
  difference_y = 0;
  cached_difference_x = 0;
  cached_difference_y = 0;
  starting_x = 0;
  starting_y = 0;
  var map_image = document.getElementById('map_image');
  var map_outer_wrapper = document.getElementById('map_outer_wrapper');
  img_width_boundry = map_image.width/2 - map_outer_wrapper.clientWidth/2;
  img_height_boundry = map_image.height/2 - map_outer_wrapper.clientHeight/2;

  scale_factor = document.getElementById('mini_map_outer_wrapper').clientWidth / map_image.width

  document.getElementById('zoom_in').addEventListener('click', zoomIn);
  document.getElementById('zoom_out').addEventListener('click', zoomOut);
}

function startDrag(e){
  if (e.target.id == 'map_inner_wrapper'){
    clicked = true;
    starting_x = e.clientX;
    starting_y = e.clientY;
    e.preventDefault();
    e.stopPropagation();
  }
}

function dragging(e){
  if (clicked){
    difference_x = cached_difference_x + e.clientX - starting_x;
    difference_y = cached_difference_y + e.clientY - starting_y;

    if (difference_x > img_width_boundry){
      difference_x = img_width_boundry;
    }

    if (difference_x < -img_width_boundry){
      difference_x = -img_width_boundry;
    }

    if (difference_y > img_height_boundry){
      difference_y = img_height_boundry;
    }

    if (difference_y < -img_height_boundry){
      difference_y = -img_height_boundry;
    }

    var scaled_difference_x = difference_x * scale_factor;
    var scaled_difference_y = difference_y * scale_factor;

    map_inner_wrapper.style.top = 'calc(50% + ' + difference_y + 'px)';
    map_inner_wrapper.style.left = 'calc(50% + ' + difference_x + 'px)';
    mini_map_location.style.top = 'calc(50% - ' + scaled_difference_y + 'px)';
    mini_map_location.style.left = 'calc(50% - ' + scaled_difference_x + 'px)';
  }
}

function endDrag(e){
  cached_difference_x = difference_x;
  cached_difference_y = difference_y;
  clicked = false;
}

function zoomIn(){
  if (document.body.classList.contains('zoom_out')){
    document.body.classList.remove('zoom_out');
  } else if (!document.body.classList.contains('zoom_in')){
    document.body.classList.add('zoom_in');
  }
}

function zoomOut(){
  if (document.body.classList.contains('zoom_in')){
    document.body.classList.remove('zoom_in');
  } else if (!document.body.classList.contains('zoom_out')){
    document.body.classList.add('zoom_out');
  }
}