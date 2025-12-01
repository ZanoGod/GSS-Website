// --- Reservation handler (works with dynamically loaded form) ---
(function () {
  function formatDateISOToReadable(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // use event delegation so handler works even if the form is added later via fetch()
  document.addEventListener('click', function (e) {
    const el = e.target;
    // handle clicks on the button or any child (e.g. icon)
    if (!el.closest) return;
    const btn = el.closest('#bookNowBtn');
    if (!btn) return;

    // find fields (guard for missing elements)
    const carEl = document.getElementById('carSelect');
    const pickupLocEl = document.getElementById('pickupLocation');
    const dropoffLocEl = document.getElementById('dropoffLocation');
    const pickupDateEl = document.getElementById('pickupDate');
    const pickupTimeEl = document.getElementById('pickupTime');
    const dropoffDateEl = document.getElementById('dropoffDate');
    const dropoffTimeEl = document.getElementById('dropoffTime');

    if (!carEl || !pickupLocEl || !dropoffLocEl || !pickupDateEl || !dropoffDateEl) {
      alert('Reservation form fields are missing. Please reload the page.');
      return;
    }

    // Simple validation: require car and pickup date (adjust as needed)
    if (!carEl.value) {
      alert('Please select a car type.');
      carEl.focus();
      return;
    }
    if (!pickupDateEl.value) {
      alert('Please choose a pick-up date.');
      pickupDateEl.focus();
      return;
    }
    if (!dropoffDateEl.value) {
      alert('Please choose a drop-off date.');
      dropoffDateEl.focus();
      return;
    }

  


    const car = carEl.value || '—';
    const pickupLoc = pickupLocEl.value || '—';
    const dropoffLoc = dropoffLocEl.value || '—';
    const pickupDate = pickupDateEl.value;
    const pickupTime = (pickupTimeEl && pickupTimeEl.value) ? pickupTimeEl.value : '—';
    const dropoffDate = dropoffDateEl.value;
    const dropoffTime = (dropoffTimeEl && dropoffTimeEl.value) ? dropoffTimeEl.value : '—';

    const messageLines = [
      'Hello,',
      '',
      'I would like to make a car reservation with the following details:',
      '',
      '- Car: ' + car,
      '- Pick-up location: ' + pickupLoc,
      '- Pick-up date & time: ' + (pickupDate ? formatDateISOToReadable(pickupDate) + ' at ' + pickupTime : '—'),
      '- Drop-off location: ' + dropoffLoc,
      '- Drop-off date & time: ' + (dropoffDate ? formatDateISOToReadable(dropoffDate) + ' at ' + dropoffTime : '—'),
      '',
      'Please confirm availability and total cost. Thank you.'
    ];

    const formattedMessage = messageLines.join('\n');

    // store in localStorage
    try {
      localStorage.setItem('reservationMessage', formattedMessage);
    } catch (err) {
      console.error('localStorage error', err);
    }

    // optional: give quick feedback, then redirect
    // adjust path if your contact page sits elsewhere
    const contactPath = '../pages/contact.html';
    // open in same tab:
    window.location.href = contactPath;
    // OR open in new tab: window.open(contactPath, '_blank');
  });
})();
