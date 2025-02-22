/**
 * index.js
 */

(async function () {
    'use strict'

    function animate() {
        window.animatelo.tada('#name-container')
        setInterval(() => {
            window.animatelo.tada('#name-container')
        }, 2000)
    }

    animate()

})();