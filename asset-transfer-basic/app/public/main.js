(function ($) {

    "use strict";

    // Smooth scrolling for anchor links
    $('a').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });

})(jQuery);


(function ($) {
    "use strict";

    // Function to update date, day, and time
    function updateDateTime() {
        const dateTimeElement = $('#date-time');
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        const hour = now.getHours();
        const minute = now.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        const timeString = ' '+ formattedHour + ':' + (minute < 10 ? '0' : '') + minute + ' ' + ampm;
        const dateTimeString =' <strong>'+ dateString  + timeString + '</strong>';
        dateTimeElement.html(dateTimeString);
    }

    // Call the function to update date, day, and time
    updateDateTime();

    // Update date, day, and time every second
    setInterval(updateDateTime, 1000);

    // Smooth scrolling for anchor links
    $('a').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });


})(jQuery);

