/* eslint-disable cypress/no-unnecessary-waiting */
// beforeEach(cy.login)

describe('Tools > Import', () => {
    beforeEach( () => {
        // cy.visit('/tools/import')
        cy.wait(2000)
    })

    it('Check Import Page', () => {
        // cy.title().should('contain', 'Import')
        // cy.get('.page-title > .d-flex > div').should('contain', 'Import')
        // cy.get('.card-label').should('contain', 'Import File')
        // cy.get('.p-4').should('contain', 'Import your data using an Excel spreadsheet.')
    })

    it('Check Download Template Insurance Claim', () => {
        // cy.title().should('contain', 'Import')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Claims{enter}")
        // cy.get('button.btn.btn-sm.btn-primary').should('contain', 'Download Template').click({force: true, multiple: true})
    })

    it('Check Import Insurance Claim', () => {
        // cy.title().should('contain', 'Import')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Claims{enter}")
        // cy.fixture('./file/import/import_template_insurance_claim.xlsx', 'binary')
        // .then(Cypress.Blob.binaryStringToBlob)
        // .then(fileContent => {
        //     cy.get("input[type='file']").attachFile({ 
        //         fileContent,
        //         fileName: 'import_template_insurance_claim.xlsx',
        //         mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        //         encoding: 'utf8' 
        //     })
        // })
        // cy.get('.card-footer > .d-flex > :nth-child(2) > .btn').should('contain', 'Next').click().then(() => {
            // cy.get('select[name="Asset ID*"]').select('No Column')
            // cy.get('select[name="Warranty Description*"]').select('No Column')
            // cy.get('select[name="Asset ID*"]').select('Warranty Description*')
            // cy.get('select[name="Warranty Description*"]').select('Asset ID*')
        //     })
        //     cy.get('.card-footer > .d-flex > :nth-child(2) > .btn').should('contain', 'Next').click().then(() => {
        //     })
        //     cy.get('.card-footer > .d-flex > :nth-child(2) > .btn').should('contain', 'Import').click().then(() => {
        //         cy.intercept('POST', '**/import/*').as('postImport')
        //     })
    })
})    