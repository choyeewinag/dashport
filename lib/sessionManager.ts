import { OakContext, UserProfile } from './types.ts';

/**
 * Takes in the framework to use for SessionManager
 * 
 * EXAMPLE:
 * 
 *   const sm = new SessionManager('oak');
 * 
 * When using an instance of SessionManager, only use
 *   sm.logIn();
 *   sm.logOut();
 *   sm.isAuthenticated();
 * 
 * @param {string} framework - The name of the server framework to be used
 */
class SessionManager {
  logIn: Function;
  logOut: Function;
  isAuthenticated: Function;
  
  constructor(framework: string): void {
    this.logIn = _logInDecider(framework);
    this.logOut = _logOutDecider(framework);
    this.isAuthenticated = _isAuthenticatedDecider(framework);
  }

  /**
   * Takes in the name of the framework the developer is using and returns a
   * function that will add a dashport.session object onto the browser's http 
   * object. This will allow information across different requests to persist
   * 
   * TODO: Add other frameworks
   * 
   * @param {string} framework - Name of the framework the developer is using
   * @returns {Function} The function that adds the dashport.session object onto
   *   the browser's http object
   */
  _logInDecider(framework: string): Function {
    if (framework = 'oak') {
      return function(ctx: OakContext, serializedId: string): void {
        ctx.state.dashport.session = { userId: serializedId };
      }
    }

    throw new Error('Name of framework passed in is not supported');
  }

  /**
   * Takes in the name of the framework the developer is using and returns a
   * function that will delete the session object on the browser's http object
   * 
   * @param {string} framework - Name of the framework the developer is using
   * @returns {Function} The function that deletes the session object from the
   *   browser's http object
   */
  _logOutDecider(framework: string): Function {
    if (framework = 'oak') {
      return function(ctx: OakContext): void {
        delete ctx.state.dashport.session
      }
    }

    throw new Error('Name of framework passed in is not supported');
  }

  /**
   * Takes in the name of the framework the developer is using and returns a
   * function that will check if the userId passed in matches the session
   * object's userId
   * 
   * TODO: Add other frameworks
   *  
   * @param {string} framework - Name of the framework the developer is using
   * @returns {Function} The function that checks if the userId passed in
   *   matches the session object's userId
   */
  _isAuthenticatedDecider(framework: string): Function {
    if (framework = 'oak') {
      return function(ctx: OakContext, serializedId: string): boolean {
        if (ctx.state.dashport.session) {
          if (serializedId === ctx.state.dashport.session.userId) return true;
          return false;
        }

        return false;
      }
    }

    throw new Error('Name of framework passed in is not supported');
  }
}

export default SessionManager;