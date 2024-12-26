beforeEach(cy.login)

describe('Asset Status, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/settings/asset-status')
        cy.intercept('GET', `**/setting/status/**`).as('getAssetStatus')
    })

    it('Fecth Asset Status', () => {
        cy.get('#kt_toolbar_container > .page-title').find('h1 > div').contains('Asset Status')
        cy.get('.post > #kt_content_container').find('.card-custom').within(() => {
            cy.get('.card-body').within(() => {
                cy.get('.table-responsive > table').find('thead, tbody')
                cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
            })
        })
    })

    it('Test Search', () => {
       cy.get('[data-cy=search]').click({force: true}).type('Dino')
       cy.intercept('GET', `**/setting/status/**`)
    })

    it('Sort by Asset Status', () => {
        cy.get(':nth-child(3) > .d-flex > .svg-icon > .mh-50px').click({force : true})
        cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
    })

    it('Test Number for Data', () => {
        cy.get('select[name*="number_of_page"]').select('25')
    })

    it('Test Pagination', () => {
        cy.get('.page-link').contains("2").click({force: true})
        cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
    })
})

describe('Asset Status Actions, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/settings/asset-status')
        cy.intercept('GET', `**/setting/status/**`).as('getAssetStatus')
    })

    it('Test Export To PDF', () => {
        cy.get('[data-cy=actions]').click({force: true})
        cy.get('[data-cy=exportToPDF]').click({force:true})
            cy.get('.modal-header').find('.modal-title').contains('Download File Export')
            cy.get('.modal-body').contains('Are you sure want to download pdf file ?')
            cy.get('.modal-footer').find('button[type=submit] > span').contains('Download').click({force : true})
    })

    it('Test Export To Excel', () => {
        cy.get('[data-cy=actions]').click({force: true})
        cy.get('[data-cy=exportToExcel]').click({force:true})
            cy.get('.modal-header').find('.modal-title').contains('Download File Export')
            cy.get('.modal-body').contains('Are you sure want to download xlsx file ?')
            cy.get('.modal-footer').find('button[type=submit] > span').contains('Download').click({force : true})
    })

    it('Test Import New Asset Status', () => {
        cy.get('[data-cy=actions]').click({force: true})
        cy.get('[data-cy=importNewAsset]').click({force:true})
    })

})

  describe('CRUD, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/settings/asset-status')
        cy.intercept('GET', `${Cypress.env('api')}setting/status/**`).as('getAssetStatus')
    })

    it('Add Asset Status', () => {
          cy.get('[data-cy=addNewAssetStatus]').click({force: true})
          cy.get('form').within(() => {
              cy.get('input[name=name]').should('have.attr', 'placeholder', 'Enter Asset Status Name')
                  .type('property', {force : true})
              cy.get('input[name=description]').should('have.attr', 'placeholder', 'Enter Description')
                  .type('cypress testing', {force : true})
              cy.get('button[type=submit]').click({force: true})
            })
            cy.intercept('POST', `${Cypress.env('api')}setting/status/**`, {statusCode:201})
      })

     it('Edit Asset Status', () => {
        cy.get('[data-cy=editTable]:first').click({force : true})
        cy.get('input[name*=name]').clear().type('Konoha', {force: true})
        cy.get('input[name*=description]').clear().type('Inc', {force: true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('PUT', '**/setting/status/**', { statusCode : 200})

    })

    it('Delete Asset Status', () => {
        cy.get('[data-cy=deleteTable]:first').click({force : true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('DELETE', '**/setting/status/**', { statusCode : 200})
    })

      it('Detail Asset Status', () => {
          cy.get('[data-cy=viewTable]:first').click({force:true})
          cy.get('button[type=button]').contains('Cancel').click({force:true})

      })

      it('Bulk Delete Asset Status', () => {
          cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force:true})
          cy.get(':nth-child(2) > :nth-child(1) > .me-2').click({force : true})
          cy.get('button[type=submit]').click({force:true})
          cy.intercept('POST', `${Cypress.env('api')}setting/status/**`, {statusCode:200})
      })
  })
