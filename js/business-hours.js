/**
 * 4154 Tattoo Shop - Business Hours Tracking
 * Real-time status updates with luxury styling
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Business hours configuration
    const BUSINESS_HOURS = {
        0: null, // Sunday - Closed
        1: { open: 10, close: 20 }, // Monday: 10AM - 8PM
        2: { open: 10, close: 20 }, // Tuesday: 10AM - 8PM
        3: { open: 10, close: 20 }, // Wednesday: 10AM - 8PM
        4: { open: 10, close: 20 }, // Thursday: 10AM - 8PM
        5: { open: 10, close: 20 }, // Friday: 10AM - 8PM
        6: { open: 12, close: 18 }, // Saturday: 12PM - 6PM
    };

    const statusBanner = document.getElementById('business-status-banner');
    const statusText = document.getElementById('status-text');
    const currentTimeDisplay = document.getElementById('current-time');
    const statusDot = document.getElementById('status-dot');

    let updateInterval;

    // Initialize business hours system
    function initializeBusinessHours() {
        if (!statusBanner || !statusText || !currentTimeDisplay || !statusDot) {
            console.warn('Business hours elements not found');
            return;
        }

        updateBusinessStatus();
        
        // Update every minute
        updateInterval = setInterval(updateBusinessStatus, 60000);
        
        console.log('✅ Business Hours System initialized');
    }

    // Update business status display
    function updateBusinessStatus() {
        const now = new Date();
        const currentDay = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour + (currentMinute / 60);

        const todayHours = BUSINESS_HOURS[currentDay];
        const status = getBusinessStatus(currentTime, todayHours, now);

        updateStatusDisplay(status, now);
        updateBackToTopButton(status);
        updatePhoneAnimation(status);
    }

    // Determine current business status
    function getBusinessStatus(currentTime, todayHours, now) {
        if (!todayHours) {
            return {
                isOpen: false,
                statusText: 'Closed Today',
                nextOpen: getNextOpenTime(now),
                statusClass: 'closed'
            };
        }

        const { open, close } = todayHours;
        const isOpen = currentTime >= open && currentTime < close;

        if (isOpen) {
            const minutesUntilClose = Math.round((close - currentTime) * 60);
            const hoursUntilClose = Math.floor(minutesUntilClose / 60);
            const minsUntilClose = minutesUntilClose % 60;

            let closingText = '';
            if (hoursUntilClose > 0) {
                closingText = `Closes in ${hoursUntilClose}h ${minsUntilClose}m`;
            } else {
                closingText = `Closes in ${minsUntilClose} minutes`;
            }

            return {
                isOpen: true,
                statusText: `Open Now • ${closingText}`,
                statusClass: 'open'
            };
        } else {
            // Closed - check if opening today or next day
            if (currentTime < open) {
                // Will open today
                const minutesUntilOpen = Math.round((open - currentTime) * 60);
                const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
                const minsUntilOpen = minutesUntilOpen % 60;

                let openingText = '';
                if (hoursUntilOpen > 0) {
                    openingText = `Opens in ${hoursUntilOpen}h ${minsUntilOpen}m`;
                } else {
                    openingText = `Opens in ${minsUntilOpen} minutes`;
                }

                return {
                    isOpen: false,
                    statusText: `Closed • ${openingText}`,
                    statusClass: 'closed'
                };
            } else {
                // Closed for the day
                return {
                    isOpen: false,
                    statusText: 'Closed Today',
                    nextOpen: getNextOpenTime(now),
                    statusClass: 'closed'
                };
            }
        }
    }

    // Get next opening time
    function getNextOpenTime(now) {
        const currentDay = now.getDay();
        let checkDay = (currentDay + 1) % 7;
        let daysAhead = 1;

        // Look for next opening day (up to 7 days)
        for (let i = 0; i < 7; i++) {
            const dayHours = BUSINESS_HOURS[checkDay];
            if (dayHours) {
                const dayName = getDayName(checkDay);
                const openTime = formatTime(dayHours.open);
                
                if (daysAhead === 1) {
                    return `Opens tomorrow (${dayName}) at ${openTime}`;
                } else {
                    return `Opens ${dayName} at ${openTime}`;
                }
            }
            checkDay = (checkDay + 1) % 7;
            daysAhead++;
        }

        return 'Schedule unavailable';
    }

    // Update status display
    function updateStatusDisplay(status, now) {
        if (statusText) {
            statusText.textContent = status.statusText;
        }

        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatCurrentTime(now);
        }

        if (statusDot) {
            statusDot.className = `status-dot ${status.statusClass}`;
        }

        // Update banner background based on status
        if (statusBanner) {
            if (status.isOpen) {
                statusBanner.style.background = 'linear-gradient(135deg, #1a4a1a, #2d5a2d)';
                statusBanner.style.borderBottomColor = '#00ff00';
            } else {
                statusBanner.style.background = 'linear-gradient(135deg, #4a1a1a, #5a2d2d)';
                statusBanner.style.borderBottomColor = '#ff4444';
            }
        }
    }

    // Update back to top button with business status
    function updateBackToTopButton(status) {
        const backToTopBtn = document.getElementById('back-to-top');
        const backToTopStatus = document.getElementById('back-to-top-status');
        
        if (backToTopBtn && backToTopStatus) {
            // Remove all status classes
            backToTopBtn.classList.remove('open', 'closed', 'opening-soon');
            
            if (status.isOpen) {
                backToTopBtn.classList.add('open');
                backToTopStatus.textContent = 'OPEN';
            } else {
                // Check if opening soon (within 2 hours)
                const now = new Date();
                const currentDay = now.getDay();
                const currentTime = now.getHours() + (now.getMinutes() / 60);
                const todayHours = BUSINESS_HOURS[currentDay];
                
                let isOpeningSoon = false;
                if (todayHours && currentTime < todayHours.open) {
                    const timeUntilOpen = todayHours.open - currentTime;
                    if (timeUntilOpen <= 2) { // Opening within 2 hours
                        isOpeningSoon = true;
                    }
                }
                
                if (isOpeningSoon) {
                    backToTopBtn.classList.add('opening-soon');
                    backToTopStatus.textContent = 'SOON';
                } else {
                    backToTopBtn.classList.add('closed');
                    backToTopStatus.textContent = 'CLOSED';
                }
            }
        }
    }

    // Update phone icon animation based on business status
    function updatePhoneAnimation(status) {
        const phoneContact = document.getElementById('phone-contact');
        
        if (phoneContact) {
            // Remove all status classes
            phoneContact.classList.remove('store-open', 'store-closed');
            
            if (status.isOpen) {
                phoneContact.classList.add('store-open');
            } else {
                phoneContact.classList.add('store-closed');
            }
        }
    }

    // Format current time for display
    function formatCurrentTime(now) {
        return now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/New_York' // Adjust timezone as needed
        });
    }

    // Format hour to readable time
    function formatTime(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:00 ${period}`;
    }

    // Get day name from day index
    function getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    // Cleanup function
    function cleanup() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    }

    // Handle page visibility changes to update time when tab becomes active
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && statusBanner) {
            updateBusinessStatus();
        }
    });

    // Handle window unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize the system
    initializeBusinessHours();

    // Export for potential external use
    window.BusinessHours = {
        updateStatus: updateBusinessStatus,
        getStatus: function() {
            const now = new Date();
            const currentDay = now.getDay();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour + (currentMinute / 60);
            const todayHours = BUSINESS_HOURS[currentDay];
            
            return getBusinessStatus(currentTime, todayHours, now);
        },
        cleanup: cleanup
    };
});