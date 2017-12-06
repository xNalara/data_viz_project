function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
	const headerOffset = 40;
	var headerBottom = document.getElementById('header').getBoundingClientRect().bottom + headerOffset;
    // Partially visible elements return true:
    isVisible = elemTop < window.innerHeight && elemBottom > headerBottom && elemBottom >= 0;
    return isVisible;
}

/* control behavior of subheadings when scrolling */
window.onload = function() {
	window.onscroll = function(){	
		var subheadings = document.getElementsByClassName('subheading');
		for (var i = 0; i < subheadings.length; i++){
			if (subheadings[i].textContent == "Paintings") {
				if (isScrolledIntoView(document.getElementById('paintingsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
			if (subheadings[i].textContent == "Elements") {
				if (isScrolledIntoView(document.getElementById('elementsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
			if (subheadings[i].textContent == "Colors") {
				if (isScrolledIntoView(document.getElementById('colorsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
		}
	};}
