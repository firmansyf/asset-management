beforeEach(cy.login)
describe('Test Edit Role & Permission', () => {
    it('Edit Role & Permission', () => {
        cy.visit('setup/role-permission')
        cy.get('[data-cy=editTable]:first').click({force : true})
        cy.get('.page-title > .d-flex > div').should('contain', 'Edit Roles & Permissions')
        cy.get('.active > .mt-5 > .container > :nth-child(3) > :nth-child(1) > :nth-child(1) > .col-sm-11 > .table > thead > .border-bottom > [style="width: 10px;"] > .form-check > .form-check-input').check({force : true})
        cy.get('.d-grid > .btn-primary').click({force : true})
    })
})