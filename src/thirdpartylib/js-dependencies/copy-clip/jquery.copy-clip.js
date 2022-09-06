$(function () {
    $.fn.copyClip = () => {
        let copyBtn = document.querySelector('#copy_btn');
        copyBtn.addEventListener('click', () => {
            let container = document.querySelector('.full-width');
            let body = document.querySelector('body');
            let content = document.querySelector('#copy_content').textContent;
            let html = document.querySelector('html');
            navigator.clipboard.writeText(content);
            container.classList.add('active');
            body.classList.add('active');
            copyBtn.classList.add('active');
            if (html.lang != 'en') {
                copyBtn.innerHTML = 'Code Copié';
                copyBtn.setAttribute('data-original-title', 'Code Copié');

            } else {
                copyBtn.innerHTML = 'Code Copied';
                copyBtn.setAttribute('data-original-title', 'Code Copied');
            }

            setTimeout(() => {
                container.classList.remove('active');
                body.classList.remove('active');
                copyBtn.classList.remove('active');
            }, 2500)
        })

        return this;
    }

}(jQuery));