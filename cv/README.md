# CV

`cv.html` est la source du CV (A4, une page, police Inter). Le PDF publié est `public/cv-rudy-gault.pdf` (copie dans ce dossier).

Régénérer : ouvrir `cv.html` dans Chromium et imprimer en PDF (A4, marges nulles, fonds activés), ou avec Playwright : `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })`. Vérifier que le résultat tient sur une page.
