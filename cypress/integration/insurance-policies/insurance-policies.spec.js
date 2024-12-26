/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('FE-1240 [INSURANCE POLICIES] Unable to filter insurance policy status', () => {
  it('Filter Status', () => {
    cy.visit('insurance/policies')
    cy.wait(20000)
    cy.get('.dropdown > .dropdown-toggle').contains('Filter').click({force: true})
    cy.get('.dropdown').find('input[type="checkbox"][value="is_active"]').check({force: true})
    cy.get('button').contains('Choose Status').click({force: true})
    cy.get('.dropdown-menu.show .row .dropdown-item:first').find('input[type="checkbox"][name="is_active"]').check({force: true})
    cy.wait(3000)
    cy.get('table').find('tbody > tr').should('have.length.greaterThan', 0)
  })
})

describe('[ Insurance Policies ] Index Page', () => {
  beforeEach(() => {
    cy.visit('insurance/policies')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/insurance/filter*').as('getInsurancePolicies')
    cy.intercept('POST', '**/insurance').as('addInsurancePolicies')
    cy.intercept('PUT', '**/insurance/**').as('updateInsurancePolicies')
    cy.intercept('DELETE', '**/insurance/**').as('deleteInsurancePolicies')
  })

  it('Search Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get('#kt_filter_search').type('Testing Insurance Policy v1',{force: true})
      cy.get('.table-responsive table').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Testing Insurance Policy v1')
      })
    })
  })

  it('Table Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })
  })

  it('Add Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=addInsurancePolicy]").click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

      cy.get('form').within( () => {
        cy.get('input[name=name]').type('Insurance Policies : ' + Date.now())
        cy.get('textarea[name=description]').type('Insurance Policies : ' + Date.now(), {force: true})

        cy.get('input[name=email]').type(Date.now() + '@ex.co', {force: true})
        cy.get('input[name=insurer]').type(Date.now(), {force: true})
        cy.get('input[name=policy_no]').type(Date.now(), {force: true})
        cy.get('input[name=contact_person]').type('Policies : ' + Date.now(), {force: true})
        cy.get('input[name=coverage]').type(Date.now(), {force: true})
        cy.get('input[name=phone_number]').type(Date.now(), {force: true})

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

        cy.wait('@addInsurancePolicies').its('response.statusCode').should('be.oneOf', [200, 201])
        // cy.wait('@getInsurancePolicies')
      })
    })
  })

  it('Add Insurance Policies ( Check Notif Mandatory )', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=addInsurancePolicy]").click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

      cy.wait(1000)
      cy.get('.modal-footer > .btn-primary').click({force: true})
  
      cy.wait(1000)
      cy.contains('This policy name is required').should('exist')
      cy.contains('This policy description is required').should('exist')
      cy.contains('This limit is required').should('exist')
      cy.contains('This deductible is required').should('exist')
      cy.contains('This premium is required').should('exist')
      cy.contains('Start date is required').should('exist')
      cy.contains('End date is required').should('exist')
    })
  })

  it('Update Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=editTable]").first().click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

      cy.get('form').within( () => {
        cy.get('input[name=name]').clear({force: true})
        cy.get('textarea[name=description]').clear({force: true})
        cy.get('input[name=email]').clear({force: true})
        cy.get('input[name=insurer]').clear({force: true})
        cy.get('input[name=policy_no]').clear({force: true})
        cy.get('input[name=contact_person]').clear({force: true})
        cy.get('input[name=coverage]').clear({force: true})
        cy.get('input[name=phone_number]').clear({force: true})
        cy.get('input[name=limit]').clear({force: true})
        cy.get('input[name=deductible]').clear({force: true})
        cy.get('input[name=premium]').clear({force: true})
        cy.get('textarea[name=descr_document]').clear({force: true})

        cy.get('input[name=name]').type('Insurance Policies : ' + Date.now(), {force: true})
        cy.get('textarea[name=description]').type('Insurance Policies : ' + Date.now(), {force: true})
        cy.get('input[name=email]').type(Date.now() + '@ex.co', {force: true})
        cy.get('input[name=insurer]').type(Date.now(), {force: true})
        cy.get('input[name=policy_no]').type(Date.now(), {force: true})
        cy.get('input[name=contact_person]').type('Policies : ' + Date.now(), {force: true})
        cy.get('input[name=coverage]').type(Date.now(), {force: true})
        cy.get('input[name=phone_number]').type(Date.now(), {force: true})
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

        cy.wait('@updateInsurancePolicies').its('response.statusCode').should('be.oneOf', [200, 201])
        // cy.wait('@getInsurancePolicies')
      })
    })
  })

  it('Delete Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=deleteTable]").first().click({force: true})

      cy.wait(5000)
      cy.get('.modal-footer > .btn-primary').click({force: true})
      cy.wait('@deleteInsurancePolicies').its('response.statusCode').should('be.oneOf', [200, 201])
    })
    cy.wait('@getInsurancePolicies')
  })

  it('Detail Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=viewTable]").first().click({force: true})
    })
  })

  it('Detail Delete Insurance Policies', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=viewTable]:first").click({force: true})

      cy.wait(10000)
      cy.get("[data-cy=btnDetailDelete]").click({force: true})
      cy.get('.modal-footer > .btn-primary').click({force: true})
    })
  })

  it('Delete Insurance Policies ( FE-2248 Validation Title Header )', () => {
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get("[data-cy=deleteTable]").first().click({force: true})
      cy.get('.modal-title').should('contain', 'Delete Insurance Policy').should('exist')
    })
  })

  it('Bulk Delete Insurance Policies ( FE-2248 Validation Title Header )', () => {
    cy.wait('@getInsurancePolicies').then(() => {
      cy.get('[data-cy=checkbokBulk]').check({force: true})
      cy.get('[data-cy=bulkDelete]').click({force : true})
      cy.get('.modal-title').should('contain', 'Delete Insurance Policy').should('exist')
    })       
  })
})
