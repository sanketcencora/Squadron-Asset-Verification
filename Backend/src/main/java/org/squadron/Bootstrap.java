package org.squadron;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.squadron.service.UserService;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class Bootstrap {

    @Inject
    UserService userService;

    void onStart(@Observes StartupEvent ev) {
        // Ensure demo users exist (register will hash passwords)
        if (userService.findByUsername("sarah.chen").isEmpty()) {
            userService.register("sarah.chen", "password", "finance", "Sarah Chen");
        }
        if (userService.findByUsername("michael.torres").isEmpty()) {
            userService.register("michael.torres", "password", "manager", "Michael Torres");
        }
        if (userService.findByUsername("audio.video.manager").isEmpty()) {
            userService.register("audio.video.manager", "password", "audio_video_manager", "Audio Video Manager");
        }
        if (userService.findByUsername("network.equipment.manager").isEmpty()) {
            userService.register("network.equipment.manager", "password", "network_equipment_manager", "Network Equipment Manager");
        }
        if (userService.findByUsername("furniture.manager").isEmpty()) {
            userService.register("furniture.manager", "password", "furniture_manager", "Furniture Manager");
        }
        if (userService.findByUsername("emily.johnson").isEmpty()) {
            userService.register("emily.johnson", "password", "employee", "Emily Johnson");
        }
    }
}
