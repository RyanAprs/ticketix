const IsLoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-blue-600">Loading...</p>
      </div>
    </div>
  );
};

export default IsLoadingPage;
