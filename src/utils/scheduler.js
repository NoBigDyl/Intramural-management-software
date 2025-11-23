export const generateRoundRobin = (teams, settings) => {
    const { startDate, weeks, daysOfWeek, timeSlots, location } = settings;
    if (!teams || teams.length < 2) return [];

    const matches = [];
    const teamList = [...teams];

    // Add dummy team if odd number
    if (teamList.length % 2 !== 0) {
        teamList.push({ id: null, name: 'BYE' });
    }

    const numRounds = teamList.length - 1;
    const halfSize = teamList.length / 2;

    // Generate all available time slots
    let availableSlots = [];
    let currentDate = new Date(startDate);

    // Loop through weeks
    for (let w = 0; w < weeks; w++) {
        // Loop through days of week (0=Sun, 1=Mon, etc.)
        // We need to find the next occurrence of each day
        daysOfWeek.forEach(dayIndex => {
            // Clone current date to find specific day in this week
            // This logic assumes startDate is the beginning of the period
            // A better approach: iterate day by day from startDate
        });
    }

    // Simpler slot generation:
    // Iterate from startDate for (weeks * 7) days
    // If day matches daysOfWeek, add timeSlots for that day
    availableSlots = [];
    let iteratorDate = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (weeks * 7));

    while (iteratorDate < endDate) {
        if (daysOfWeek.includes(iteratorDate.getDay())) {
            timeSlots.forEach(time => {
                // Create ISO string for this slot
                const slotDate = new Date(iteratorDate);
                const [hours, minutes] = time.split(':');
                slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                availableSlots.push(slotDate.toISOString());
            });
        }
        iteratorDate.setDate(iteratorDate.getDate() + 1);
    }

    let slotIndex = 0;

    for (let round = 0; round < numRounds; round++) {
        for (let i = 0; i < halfSize; i++) {
            const home = teamList[i];
            const away = teamList[teamList.length - 1 - i];

            // If not a BYE match
            if (home.id && away.id) {
                // Assign to next available slot
                // If run out of slots, maybe loop back or stop?
                // For now, let's assume we just keep filling or stop if empty
                if (slotIndex < availableSlots.length) {
                    matches.push({
                        home_team_id: home.id,
                        away_team_id: away.id,
                        start_time: availableSlots[slotIndex],
                        location: location || 'Main Gym',
                        status: 'scheduled'
                    });
                    slotIndex++;
                }
            }
        }

        // Rotate teams (keep first fixed)
        teamList.splice(1, 0, teamList.pop());
    }

    return matches;
};

export const calculateDateOffset = (sourceDate, targetDate) => {
    const start = new Date(sourceDate);
    const end = new Date(targetDate);
    return end - start; // Difference in milliseconds
};
