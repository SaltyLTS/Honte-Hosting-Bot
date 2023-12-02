const { 
    Events,
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder
} = require('discord.js');

module.exports = {
    EventName: Events.InteractionCreate,
    async startAsync(interaction) {
        if(interaction.isStringSelectMenu()) {
            let CategorySelected = interaction.values[0].split("_");

            const TicketModal = new ModalBuilder()
                .setTitle("HHTickets - Formulaire");

            const TicketInputOption_1 = new TextInputBuilder()
                .setCustomId("HHTickets_TicketModal_Option_1")
                .setStyle(TextInputStyle.Short);

            const TicketInputOption_2 = new TextInputBuilder()
                .setCustomId("HHTickets_TicketModal_Option_2")
                .setStyle(TextInputStyle.Paragraph);

            switch(CategorySelected[CategorySelected.length - 1]) {
                case "1":
                    TicketModal.setCustomId("HHTickets_TicketModal_" + CategorySelected[CategorySelected.length - 1]);

                    TicketInputOption_1.setPlaceholder("Write your title here");
                    TicketInputOption_1.setLabel("Title:");

                    TicketInputOption_2.setPlaceholder("Describe your request here");
                    TicketInputOption_2.setLabel("Request:");
        
                    TicketModal.addComponents(
                        new ActionRowBuilder().addComponents(TicketInputOption_1), 
                        new ActionRowBuilder().addComponents(TicketInputOption_2)
                    );
        
                    await interaction.showModal(TicketModal);
                break;
                case "2":
                    TicketModal.setCustomId("HHTickets_TicketModal_" + CategorySelected[CategorySelected.length - 1]);

                    TicketInputOption_1.setPlaceholder("Write your title here");
                    TicketInputOption_1.setLabel("Title:");
                
                    TicketInputOption_2.setPlaceholder("Describe your request here");
                    TicketInputOption_2.setLabel("Request:");
        
                    TicketModal.addComponents(
                        new ActionRowBuilder().addComponents(TicketInputOption_1), 
                        new ActionRowBuilder().addComponents(TicketInputOption_2)
                    );
        
                    await interaction.showModal(TicketModal);
                break;
                case "3":
                    TicketModal.setCustomId("HHTickets_TicketModal_" + CategorySelected[CategorySelected.length - 1]);

                    TicketInputOption_1.setPlaceholder("Rust, Garry's mod, Minecraft...");
                    TicketInputOption_1.setLabel("Concerned game:");
                    
                    TicketInputOption_2.setPlaceholder("Describe your request here");
                    TicketInputOption_2.setLabel("Request:");
        
                    TicketModal.addComponents(
                        new ActionRowBuilder().addComponents(TicketInputOption_1), 
                        new ActionRowBuilder().addComponents(TicketInputOption_2)
                    );
        
                    await interaction.showModal(TicketModal);
                break;
                case "4":
                    TicketModal.setCustomId("HHTickets_TicketModal_" + CategorySelected[CategorySelected.length - 1]);

                    TicketInputOption_1.setPlaceholder("NodeJS, Python...");
                    TicketInputOption_1.setLabel("Concerned application:");

                    TicketInputOption_2.setPlaceholder("Describe your request here");
                    TicketInputOption_2.setLabel("Request:");
        
                    TicketModal.addComponents(
                        new ActionRowBuilder().addComponents(TicketInputOption_1), 
                        new ActionRowBuilder().addComponents(TicketInputOption_2)
                    );
        
                    await interaction.showModal(TicketModal);
                break;
                case "5":
                    TicketModal.setCustomId("HHTickets_TicketModal_" + CategorySelected[CategorySelected.length - 1]);

                    TicketInputOption_1.setPlaceholder("Write your title here");
                    TicketInputOption_1.setLabel("Title:");

                    TicketInputOption_2.setPlaceholder("Describe your request here");
                    TicketInputOption_2.setLabel("Request:");
        
                    TicketModal.addComponents(
                        new ActionRowBuilder().addComponents(TicketInputOption_1), 
                        new ActionRowBuilder().addComponents(TicketInputOption_2)
                    );
        
                    await interaction.showModal(TicketModal);
                break;
            };
        };
    }
};