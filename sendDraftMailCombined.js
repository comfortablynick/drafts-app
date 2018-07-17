/* Send Draft Mail Combined
 * 
 * Prompts for HTML or text when sending draft as email
 */

(() => {
    const 
        opts = ['Plain Text', 'HTML'],
        p = opts.reduce(
            (prompt, buttonName) => {
                prompt.addButton(buttonName);
                return prompt;
            },
            Object.assign(
                Prompt.create(), {
                    title: 'Mail',
                    message: 'Choose format to send mail',
                    isCancellable: true
                }
            )
        ),
        choice = p.show(),
        html = p.buttonPressed == 'HTML' ? true : false,
        body = html ? draft.processTemplate('%%[[body]]%%'): draft.processTemplate('[[body]]'),
        mail = Object.assign(Mail.create(), {
          subject: draft.title,
            body: body,
          isBodyHTML: html
        }),
        success = mail.send();
    if (!success) {
      console.log(mail.status);
      context.fail();
    }
})()