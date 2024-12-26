beforeEach(cy.login)

describe('Profile Page, Change Password', () => {
    beforeEach( () => {
        cy.visit('profile/change-password')
        cy.intercept('**/api/**').as('api')
    })

    it('Check Change Password page & Form', () => {
        cy.wait('@api')
        cy.get('.bg-primary.border-primary.text-white.fw-bolder').should('contain', 'Change Password')
        cy.get('.card-body').find('.tab-content').find('form')
         .within(() => {
            cy.get(':nth-child(1) > .col-4 > .col-form-label').should('contain', 'Current Password')
            cy.get(':nth-child(2) > .col-4 > .col-form-label').should('contain', 'New Password')
            cy.get(':nth-child(3) > .col-4 > .col-form-label').should('contain', 'Repeat New Password')
            cy.get('input[name*="old_password"]').type('oldpassword').should('be.visible')
            cy.get('input[name*="new_password"]').eq(0).type('newpassword').should('be.visible')
            cy.get('input[name*="new_password_confirm"]').eq(0).type('newpassword').should('be.visible')
            // cy.get('.btn-sm.btn.btn-primary').should('contain', 'Save').and('be.visible')
        })
    })

    it('Check Show Current password As Text Type', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get('input[name*="old_password"]').eq(0).clear({force: true}).type('testCurrentPassword').blur({force: true})
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
        })
    })

    it('Check Validation Input Current Password', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get('input[name*="old_password"]').clear({force: true}).blur({force: true})
            cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'Current Password is required')
        })
    })

    it('Check Validation Input New Password', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).blur({force: true})
            cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'New Password is required.')
        })
    }) 
    
    it('Check Show Input New password As Text Type', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('testNewPassword').blur({force: true})
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
        })
    })

    it('Check False Validation Special Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('testPassword').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-danger').should('contain', 'At least one special character.')
        })
    })

    it('Check True Validation Special Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('testPassword@#').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-success').should('contain', 'At least one special character.')
        })
    })

    it('Check False Validation Lowercase Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('TEST@').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-danger').should('contain', 'At least one lowercase letter.')
        })
    })

    it('Check True Validation Lowercase Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Test@').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-success').should('contain', 'At least one lowercase letter.')
        })
    })

    it('Check False Validation UpperCase Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('password@').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-danger').should('contain', 'At least one uppercase letter.')
        })
    })

    it('Check True Validation UpperCase Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Password@').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-success').should('contain', 'At least one uppercase letter.')
        })
    })

    it('Check False Validation Number Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Password@').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-danger').should('contain', 'At least one number.')
        })
    })
    
    it('Check False Validation Minimum 8 Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Pad@1').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-danger').should('contain', 'Min 8 character.')
        })
    })
    
    it('Check True Validation Minimum 8 Character', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true}) 
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})
            cy.get('div.fv-plugins-message-container.invalid-feedback > div > p.text-success').should('contain', 'Min 8 character.')
        })
    })

    it("Check Repeat Password Error doesn't match", () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})
            cy.get(':nth-child(3) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password_confirm"]').eq(0).clear({force: true}).type('Pad@2R123').blur({force: true})
            cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', "Repeat password doesn't match with New Password.")
        })
    })

    it('Test Change Password Faild', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(1) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="old_password"]').clear({force: true}).type('oldPass123@').blur({force: true})

            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})

            cy.get(':nth-child(3) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password_confirm"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})
            // cy.get('button[type=submit]').click({force: true})
            // cy.intercept('PUT', '**/password').as('changePassword1')
            // cy.get('div.Toastify').should('be.visible')
        })
    })

    it('Test Change Password Success', () => {
        cy.wait('@api')
        cy.get('.card-body').find('.tab-content').find('form')
        .within(() => {
            cy.get(':nth-child(1) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="old_password"]').clear({force: true}).type('oldPass123@').blur({force: true})

            cy.get(':nth-child(2) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})

            cy.get(':nth-child(3) > .col-8 > .pass-wrapper > .visible > .svg-icon > .mh-50px').click({force: true})
            cy.get('input[name*="new_password_confirm"]').eq(0).clear({force: true}).type('Pad@1R123').blur({force: true})
            // cy.get('button[type=submit]').click({force: true})
            // cy.intercept('PUT', '**/password').as('changePassword2')
            // cy.get('.swal2-popup').should('be.visible')
        })
    })
})
