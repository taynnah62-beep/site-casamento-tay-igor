// Atualize estas URLs quando tiver os links finais de RSVP e lista de presentes
window.SITE_LINKS = {
  rsvp: 'https://assessoriavip.com.br/rsvpUnico/9b090080-4598-11f1-a88e-5dc6b3c65ef4',
  gifts: 'https://noivos.casar.com/124207?utm_source=parceiros&utm_campaign=assessoria-vip'
};

(function () {
  function applyLink(id, url) {
    if (!url) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
  applyLink('rsvpLink', window.SITE_LINKS.rsvp);
  applyLink('giftsLink', window.SITE_LINKS.gifts);
})();
