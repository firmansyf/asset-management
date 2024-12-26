beforeEach(cy.login)

describe('[ Ticket Detail ] To Do', () => {
  beforeEach(() => {
    cy.visit('help-desk/ticket')
  })

  it('Detail Ticket - Add To Do', () => {
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})

    cy.wait(3000)
    cy.get('[data-cy=todoName]').type('Test To Do', {force:true})
    cy.get('[data-cy=saveToDo]').click({force:true})
  })

  it('Detail Ticket - Update To Do', () => {
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})

    cy.wait(3000)
    cy.get('[data-cy=editTodo]').first().click({force:true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Edit ToDo')
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Detail Ticket - Check To Do List', () => {
    cy.wait(3000)
    cy.get('[data-cy=viewTable]').first().click({force:true})

    cy.wait(3000)
    cy.get('[data-cy="typeTodo"]').should('be.visible')
    cy.get('[data-cy="editTodo"]').should('be.visible')
    cy.get('[data-cy="deleteTodo"]').should('be.visible')
  })
})
