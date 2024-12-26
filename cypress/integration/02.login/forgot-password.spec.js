/* eslint-disable cypress/no-unnecessary-waiting */
describe('Forgot Password', () => {
    it('check forgot password form', () => {
      cy.visit('auth/login')
      cy.wait(3000)
      cy.get('img.h-45px').should('be.visible')
      cy.get('.justify-content-center > :nth-child(1) > .form-label').should('contain', 'Email')
      cy.get('.d-flex > .form-label').should('contain', 'Password')
      cy.get('.link-primary').should('contain', 'Forgot Password')
      cy.get('.forgot-password').should('contain', 'Forgot Password').click({force: true})
      cy.wait(3000)
      cy.get('.form-label').should('contain', 'Email')
      cy.get('[data-cy=kt_password_reset_submit]').should('contain', 'Submit')
      cy.get('[data-cy=kt_login_password_reset_form_cancel_button]').should('contain', 'Cancel')
    })

    // it('check submit forgot password', () => {
    //   cy.visit('auth/login')
    //   cy.wait(5000)
    //   cy.get('img.h-45px').should('be.visible')
    //   cy.get('.justify-content-center > :nth-child(1) > .form-label').should('contain', 'Email')
    //   cy.get('.d-flex > .form-label').should('contain', 'Password')
    //   cy.get('.link-primary').should('contain', 'Forgot Password')
    //   cy.get('.forgot-password').should('contain', 'Forgot Password').click({force: true})
    //   cy.get('input[name="email"]').type('adila@assetdata.io', {force: true}).blur({force: true})
    //   cy.get('#kt_password_reset_submit').should('contain', 'Submit').click({force: true})
    //   cy.get('.p-4').should('contain', 'If the email address exists, an email will be sent to')
    // })
  })