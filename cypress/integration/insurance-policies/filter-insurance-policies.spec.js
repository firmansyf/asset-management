beforeEach(cy.login)

describe('[ Insurance Policies ] Filter Insurance Policies Page', () => {
  it('Filter Insurance Policies', () => {
      cy.visit('insurance/policies')
      cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
      // cy.intercept('GET', '**/insurance/filter*').as('fetchPolicies')
      cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

      cy.get(':nth-child(2) > :nth-child(1) > .btn').click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
      cy.get('form').within( () => {
          cy.get('input[name=name]').type('Insurance Policies : ' + Date.now())
          cy.get('textarea[name=description]').type('Insurance Policies : ' + Date.now(), {force: true})

          cy.get('input[name=limit]').type('11', {force: true})
          cy.get('input[name=deductible]').type('11', {force: true})
          cy.get('input[name=premium]').type('11', {force: true})

          cy.get('input[name=start_date]').click({force: true})
          cy.get('[data-value="15"]').first().click({force: true})

          cy.get('input[name=end_date]').click({force: true})
          cy.get('[data-value="16"]').last().click({force: true})

          cy.get('[data-rb-event-key="documents"]').click({force: true})
          cy.get('textarea[name=descr_document]').type('Insurance Policies : ' + Date.now(), {force: true})
          cy.get('button.btn-primary > span.indicator-label').click()
          cy.intercept('POST', "**/insurance*").as('newUser')
      })

      cy.get('[data-cy=filter] > .dropdown > .dropdown-toggle').click({force: true})
      cy.get('#column-4').click({force: true})
      cy.get('[data-cy=filter] > .dropdown > .dropdown-toggle').click({force: true})
      cy.get('.bg-white > .dropdown-toggle').click({force: true})
  })
})
