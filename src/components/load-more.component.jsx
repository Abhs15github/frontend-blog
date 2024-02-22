const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    if (state != null && state.totalDocs > state.results.length) {
        return (
            <button
                onClick={() => fetchDataFun({ page: state.page + 1 })}
                className="text-dark-grey p-2 px-3 hover:bg-gray-300 rounded-md items-center gap-2"
            >
                Load More
            </button>
        );
    }

    return null; // Return null if the condition is not met
};

export default LoadMoreDataBtn;
