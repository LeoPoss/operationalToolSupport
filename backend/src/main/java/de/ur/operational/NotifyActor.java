package de.ur.operational;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotifyActor implements JavaDelegate {
    final SimpMessagingTemplate template;

    public NotifyActor(SimpMessagingTemplate template) {
        this.template = template;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        template.convertAndSend("/topic/notify", "Ah damn! You forgot some of your tools needed for the task");
        System.out.println("You forgot something!");
    }
}
