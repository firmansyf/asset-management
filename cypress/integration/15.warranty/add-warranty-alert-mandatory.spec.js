import moment from 'moment'
beforeEach(cy.login)

  describe('[ Warranty ] Add Warranty Check Alert Mandatory', () => {
    it('Add Warranty Check Alert Mandatory', () => {
      cy.visit('warranty')
      // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
      cy.intercept('GET', '**/api/**').as('fetchDatabase')
      cy.intercept('GET', '**/api/**').as('fetchAsset')
      cy.intercept('GET', '**/api/**').as('fetchWarranty')
      // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

      cy.get('[data-cy=addWarranty]').click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
      cy.get('form').within( () => {
        // cy.get('input[name=asset_guid]')
        cy.get('input[name=description]').type('Descr Warranty', {force: true})
        cy.get('input[name=length]').type('11', {force: true})
        cy.get('.modal-footer > .btn-primary').click({force: true})
        cy.intercept('POST', '**/warranty*').as('addWarranty')
      })

     
      // cy.get('.modal').click({force: true})
      // cy.get('.mb-6 > :nth-child(2) > :nth-child(1) > .btn').click({force: true})
      // cy.get('[data-cy=addWarranty]').click({force: true})
      // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })
  })

  describe('Case By Tickets', () => {
    it('FE-2215 Custom Field - Unable to left cf blank', () => {
      cy.visit('warranty')
      cy.intercept('GET', '**/warranty*').as('getWarranty')
      cy.wait('@getWarranty')
      cy.get('[data-cy="addWarranty"]').click({force: true})
      cy.get('.modal').invoke('show').find('[data-cy="date"]:first').clear({force: true}).invoke('val', moment().format('DD/MM/YYYY')).clear().should('not.have.value')
    })
  })
