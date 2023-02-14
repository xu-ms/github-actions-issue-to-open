import smtplib

def send_email(subject, body, recipient):
    gmail_user = "YOUR_GMAIL_ADDRESS"
    gmail_password = "YOUR_GMAIL_PASSWORD"

    sent_from = gmail_user
    to = recipient
    subject = subject
    body = body

    email_text = "From: {}\nTo: {}\nSubject: {}\n\n{}".format(sent_from, to, subject, body)

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.sendmail(sent_from, to, email_text)
        server.close()

        print("Email sent!")
    except:
        print("Something went wrong...")

def check_keyword(title, keyword):
    return keyword in title

def main():
    print("Hello World!")
    #issue_title = "INSERT_ISSUE_TITLE_HERE"
    #keyword = "INSERT_KEYWORD_HERE"
    #recipient = "INSERT_RECIPIENT_EMAIL_HERE"

    #if check_keyword(issue_title, keyword):
        #send_email("Important Issue Created", "An important issue has been created with the title: {}".format(issue_title), recipient)

if __name__ == "__main__":
    main()