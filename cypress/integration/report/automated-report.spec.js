beforeEach(cy.login)

describe('Report Automated Report', () => {
    beforeEach( () => { 
        cy.visit('reports/automated-report')
      })

      it('Fetch Automation Report', () => {
        cy.intercept('GET', '/automation-report/**', {statusCode: 200})
        cy.intercept('GET', '/media/**', {delayMs: 4000}).as('fetchMedia')
        cy.get('#kt_content').find('.card-body')
        cy.get('.table-responsive table')
          .find('thead > tr > th')
          .should('have.length', 6)
    })

    it('Serach', () => {
      cy.get('input[data-test=search]').should('have.attr', 'placeholder', 'Search')
        .type('Yusuf', {force: true})
      cy.intercept('GET', `${Cypress.env('api')}automation-report/**`)
    })

    it('Test Number for Data',() => {
      cy.get('select[name*="number_of_page"]').select('25')
    })

    it('Test Pagination', () => {
      cy.get('ul.pagination > li').find('i.previous').click()
      cy.get('ul.pagination > li').find('i.next').click()
    })

})