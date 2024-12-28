package service

import (
	"fmt"
	"github.com/resend/resend-go/v2"
	"portfolio/lobby/constants"
)

type SendEmailPayload struct {
	To      []string
	Subject string
	Html    string
	Text    string
}

var client *resend.Client

func InitializeEmailClient() {
	client = resend.NewClient(constants.RESEND_API_KEY)
}

func SendEmail(payload SendEmailPayload) {
	fromEmail := "Confirmation <" + constants.FROM_EMAIL + ">"

	fmt.Printf("Sending email to %s\n", fromEmail)

	params := &resend.SendEmailRequest{
		From:    fromEmail,
		To:      payload.To,
		Html:    payload.Html,
		Subject: payload.Subject,
		Text:    payload.Text,
	}

	sent, err := client.Emails.Send(params)

	if err != nil {
		fmt.Printf("Error while sending email to %s. Error code: %s\n", payload.To, err.Error())
		return
	}
	fmt.Printf("Successfully sent the email to %s and email ID: %s\n", payload.To, sent.Id)
}
