(function () {
    'use strict';

    // --- NAVIGATION ---
    var navLinks = document.querySelectorAll('[data-page]');
    var pages = document.querySelectorAll('.page');
    var menuToggle = document.querySelector('.menu-toggle');
    var mainNav = document.querySelector('.main-nav');

    function navigateTo(pageName) {
        pages.forEach(function (p) { p.classList.remove('active'); });
        var target = document.getElementById('page-' + pageName);
        if (target) target.classList.add('active');

        navLinks.forEach(function (link) {
            link.classList.toggle('active',
                link.getAttribute('data-page') === pageName && link.closest('.main-nav'));
        });

        if (mainNav) mainNav.classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-page'));
        });
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    // --- WORKOUT LEVEL TABS ---
    var tabButtons = document.querySelectorAll('.tab-btn');
    var workoutLevels = document.querySelectorAll('.workout-level');

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var level = this.getAttribute('data-level');

            tabButtons.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            workoutLevels.forEach(function (wl) { wl.classList.remove('active'); });
            var target = document.getElementById('level-' + level);
            if (target) target.classList.add('active');
        });
    });

    // --- TRACKER: LocalStorage ---
    var STORAGE_KEY = 'fitlife_workouts';

    function getWorkouts() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveWorkouts(workouts) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        } catch (e) {
            // storage unavailable
        }
    }

    // --- TRACKER: Stats ---
    function calculateStats(workouts) {
        var total = workouts.length;
        var totalMinutes = workouts.reduce(function (sum, w) { return sum + (w.duration || 0); }, 0);

        // This week
        var now = new Date();
        var startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        var thisWeek = workouts.filter(function (w) {
            return new Date(w.date) >= startOfWeek;
        }).length;

        // Streak: consecutive days with at least one workout, ending today or yesterday
        var streak = 0;
        if (workouts.length > 0) {
            var sorted = workouts.slice().sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            var uniqueDates = [];
            sorted.forEach(function (w) {
                if (uniqueDates.indexOf(w.date) === -1) uniqueDates.push(w.date);
            });

            var today = new Date();
            today.setHours(0, 0, 0, 0);

            var checkDate = new Date(today);
            var latestWorkout = new Date(uniqueDates[0] + 'T00:00:00');

            var diffDays = Math.floor((today - latestWorkout) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                streak = 0;
            } else {
                if (diffDays === 1) {
                    checkDate.setDate(checkDate.getDate() - 1);
                }

                for (var i = 0; i < uniqueDates.length; i++) {
                    var dateStr = checkDate.toISOString().split('T')[0];
                    if (uniqueDates.indexOf(dateStr) !== -1) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        return { total: total, streak: streak, week: thisWeek, minutes: totalMinutes };
    }

    function updateStatsDisplay(stats) {
        var el = function (id) { return document.getElementById(id); };
        if (el('stat-total')) el('stat-total').textContent = stats.total;
        if (el('stat-streak')) el('stat-streak').textContent = stats.streak;
        if (el('stat-week')) el('stat-week').textContent = stats.week;
        if (el('stat-minutes')) el('stat-minutes').textContent = stats.minutes;
    }

    // --- TRACKER: Render History ---
    function renderHistory(workouts) {
        var container = document.getElementById('workout-history');
        if (!container) return;

        if (workouts.length === 0) {
            container.innerHTML = '<p class="empty-state">No workouts logged yet. Start your journey above!</p>';
            return;
        }

        var sorted = workouts.slice().sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        var html = sorted.map(function (w, index) {
            var energyLabel = {
                great: 'Great',
                good: 'Good',
                okay: 'Okay',
                tired: 'Tired'
            };
            var notesHtml = w.notes ? '<div class="history-notes">' + escapeHtml(w.notes) + '</div>' : '';

            return '<div class="history-entry">' +
                '<div class="history-info">' +
                    '<div class="history-date">' + formatDate(w.date) + '</div>' +
                    '<div class="history-type">' + escapeHtml(w.type) + '</div>' +
                    '<div class="history-duration">' + w.duration + ' minutes</div>' +
                    notesHtml +
                '</div>' +
                '<span class="history-energy energy-' + w.energy + '">' + (energyLabel[w.energy] || w.energy) + '</span>' +
                '<button class="history-delete" data-index="' + index + '" title="Delete">&times;</button>' +
            '</div>';
        }).join('');

        container.innerHTML = html;

        container.querySelectorAll('.history-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-index'));
                deleteWorkout(idx, sorted);
            });
        });
    }

    function deleteWorkout(sortedIndex, sortedWorkouts) {
        var toDelete = sortedWorkouts[sortedIndex];
        var workouts = getWorkouts();
        var realIndex = workouts.findIndex(function (w) {
            return w.date === toDelete.date && w.type === toDelete.type && w.duration === toDelete.duration;
        });
        if (realIndex !== -1) {
            workouts.splice(realIndex, 1);
            saveWorkouts(workouts);
            refreshTracker();
        }
    }

    function refreshTracker() {
        var workouts = getWorkouts();
        updateStatsDisplay(calculateStats(workouts));
        renderHistory(workouts);
    }

    // --- TRACKER: Form Submit ---
    var workoutForm = document.getElementById('workout-form');
    var dateInput = document.getElementById('workout-date');

    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    if (workoutForm) {
        workoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var workout = {
                date: document.getElementById('workout-date').value,
                type: document.getElementById('workout-type').value,
                duration: parseInt(document.getElementById('workout-duration').value),
                energy: document.getElementById('workout-energy').value,
                notes: document.getElementById('workout-notes').value.trim()
            };

            var workouts = getWorkouts();
            workouts.push(workout);
            saveWorkouts(workouts);
            refreshTracker();

            workoutForm.reset();
            if (dateInput) dateInput.valueAsDate = new Date();

            showToast('Workout logged! Keep it up!');
        });
    }

    // --- TOAST ---
    function showToast(message) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 2500);
    }

    // --- HELPERS ---
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    // --- INIT ---
    refreshTracker();
})();
