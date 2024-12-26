describe('Check login for expire billing account', () => {

    it('Check Expiry Password Screen', () => {
        cy.visit('auth/password-expiry')
        cy.get('[data-cy="passwordExpiryText"]').should('contain', 'You password has expired, you must change password before log in to your account')
        cy.get('[data-cy="passwordExpiryChangePassword"]').should('contain', 'Change Password')
      })

    it('Check Reset Password Page', () => {
        cy.visit('auth/password-expiry')
        cy.get('[data-cy="passwordExpiryChangePassword"]').should('contain', 'Change Password').click({force: true})
        cy.get(':nth-child(1) > .justify-content-between > .d-flex > .form-label').should('contain', 'New Password')
        cy.get(':nth-child(2) > .justify-content-between > .d-flex > .form-label').should('contain', 'Repeat New Password')

    })

})