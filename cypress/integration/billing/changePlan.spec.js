beforeEach(cy.login)
describe('Billing, Change Plan.', () => {
    beforeEach(() => {
        cy.visit('/billing/change-plan')
        // cy.intercept('GET', '**/plan*').as('getMonthlyPlan')
    })

    it('Check Plan List', () => {
        // cy.wait('@getMonthlyPlan').its('response.statusCode').should('be.oneOf', [200, 201, 422])
        cy.get('.page-title > .d-flex > div').should('contain', "Plan Details")
        cy.get('[style="margin-top: 50px;"] > :nth-child(1) > h5').should('contain', "Account Detail")
        cy.get('[style="margin-top: 50px;"] > :nth-child(2)').should('contain', "Current plan")
        cy.get('[style="margin-top: 50px;"] > :nth-child(3)').should('contain', "Payment cycle")
        cy.get('[style="margin-top: 50px;"] > :nth-child(4)').should('contain', "Your next bill is")
    })

    it('Check Upgrade Plan', () => {
        // cy.wait('@getMonthlyPlan').its('response.statusCode').should('be.oneOf', [200, 201, 422])
        cy.get('[data-cy="monthlyButton"]').click({force: true})
        cy.get('[data-cy=selectProfessional]').click({force: true})
        cy.get('.modal-title')
          .should('contain', "Are you sure you want to upgrade your plan?")
    })

    it('Check Downgrade Plan', () => {
        // cy.wait('@getMonthlyPlan').its('response.statusCode').should('be.oneOf', [200, 201, 422])
        cy.get('[data-cy="monthlyButton"]').click({force: true})
        cy.get('[data-cy=selectStandard]').click({force: true})
        cy.get('.modal-title')
          .should('contain', "Are you sure you want to")
        //   .should('contain', "Are you sure you want to downgrade your plan?")
    })
})
