const form = document.getElementById('Starting-Flags') as HTMLFormElement;
const FlagsLink = document.getElementById('Flags-Link') as HTMLAnchorElement;

function generateLink() {
  const formData = new FormData(form);

  if (formData.get('start') === '0') {
    formData.delete('start');
  }

  if (formData.get('hold') === '5') {
    formData.delete('hold');
  }

  if (formData.get('trans') === '1') {
    formData.delete('trans');
  }

  let queryString = new URLSearchParams(
    Array.from(
      formData.entries()
        .filter(([_, value]) => typeof value === 'string'),
    ) as Array<[string, string]>,
  ).toString();
  queryString = queryString.replace(/=on/g, '');

  let url = '/flags';

  if (queryString) {
    url += `?${queryString}`;
  }

  FlagsLink.setAttribute('href', url);
  FlagsLink.style.display = 'block';
}

form.addEventListener('submit', (event) => {
  generateLink();
  event.preventDefault();
});
