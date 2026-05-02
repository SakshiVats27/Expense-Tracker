const dataParserForItems = (items) => {
    const now = new Date().getTime();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const prev = oneMonthAgo.getTime();

    const filteredItems = items.filter(item => {
        const itemTime = new Date(item.date).getTime();
        return (itemTime >= prev && itemTime <= now);
    });

    let total = 0;
    const body = filteredItems.map((item, index) => {
        const dater = new Date(item.date);
        const txt = dater.toString();
        const formattedDate = txt.substring(8, 10) + " " + txt.substring(4, 7);
        
        total += item.amount;
        
        return [
            index + 1,
            formattedDate,
            item.amount,
            item.category
        ];
    });

    return { body, total };
}
module.exports = dataParserForItems;